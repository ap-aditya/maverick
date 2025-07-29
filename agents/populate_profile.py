import json
from sqlmodel import Session, select
from app.database import engine, create_db_and_tables
from app.models import UserProfile

YOUR_PROFILE = {
    "full_name": "Pete Mitchell",
    "summary": "Senior software engineer specializing in high-performance systems and real-time applications. Known for pushing technological boundaries and mentoring the next generation of developers. Thrives in high-pressure environments and complex technical challenges.",
    "experience": json.dumps(
        [
            {
                "title": "Lead Flight Systems Engineer",
                "company": "Northrop Dynamics",
                "duration": "Mar 2020 - Present",
                "description": "Architect and develop mission-critical flight control software for next-generation aircraft. Lead a team of 8 engineers in building real-time embedded systems with 99.99% uptime requirements.",
            },
            {
                "title": "Senior Software Developer",
                "company": "Lockheed Advanced Technologies",
                "duration": "Jun 2018 - Feb 2020",
                "description": "Developed high-speed data processing systems for aerospace applications. Implemented innovative algorithms that improved system performance by 300% over legacy solutions.",
            },
            {
                "title": "Software Engineer II",
                "company": "Raytheon Tech Solutions",
                "duration": "Aug 2016 - May 2018",
                "description": "Built distributed systems for radar and navigation applications. Specialized in low-latency C++ applications and real-time signal processing.",
            },
        ]
    ),
    "education": json.dumps(
        [
            {
                "degree": "Master of Science in Aerospace Engineering",
                "school": "Naval Postgraduate School",
                "graduation_date": "June 2016",
                "relevant_coursework": [
                    "Advanced Flight Dynamics",
                    "Embedded Systems",
                    "Real-Time Computing",
                    "Control Systems Engineering",
                ],
            },
            {
                "degree": "Bachelor of Science in Computer Engineering",
                "school": "United States Naval Academy",
                "graduation_date": "May 2014",
                "relevant_coursework": [
                    "Digital Signal Processing",
                    "Computer Architecture",
                    "Software Engineering",
                    "Mathematics",
                ],
            },
        ]
    ),
    "projects": json.dumps(
        [
            {
                "title": "TopGun Training Simulator",
                "description": "Developed a comprehensive flight training simulation system with advanced physics modeling and real-time 3D graphics. Used by elite pilot training programs worldwide.",
                "skills": [
                    "C++",
                    "OpenGL",
                    "Python",
                    "CUDA",
                    "Real-time Systems",
                    "3D Graphics",
                ],
            },
            {
                "title": "Maverick AI Navigation System",
                "description": "Created an AI-powered autonomous navigation system for unmanned aerial vehicles. Incorporates machine learning for adaptive flight path optimization in challenging environments.",
                "skills": [
                    "Python",
                    "TensorFlow",
                    "Computer Vision",
                    "ROS",
                    "GPS/IMU Integration",
                    "Edge Computing",
                ],
            },
            {
                "title": "Iceman Performance Analytics",
                "description": "Built a high-throughput data analytics platform for analyzing pilot performance metrics and aircraft telemetry. Processes terabytes of flight data in real-time.",
                "skills": [
                    "Scala",
                    "Apache Spark",
                    "Kafka",
                    "PostgreSQL",
                    "Docker",
                    "Kubernetes",
                ],
            },
        ]
    ),
    "skills": json.dumps(
        [
            "C++",
            "Python",
            "Rust",
            "Go",
            "Real-time Systems",
            "Embedded Programming",
            "CUDA",
            "OpenGL",
            "Linux",
            "Docker",
            "Kubernetes",
            "Apache Spark",
            "TensorFlow",
            "Computer Vision",
            "Signal Processing",
            "Git",
            "Jenkins",
            "PostgreSQL",
            "Redis",
            "Kafka",
            "gRPC",
            "WebGL",
            "MATLAB",
            "Simulink",
        ]
    ),
}


def populate_user_profile():
    print("🚀 Populating user profile...")
    create_db_and_tables()

    with Session(engine) as session:
        try:
            statement = select(UserProfile)
            results = session.exec(statement).all()
            for old_profile in results:
                session.delete(old_profile)
            session.commit()

            user_profile = UserProfile(**YOUR_PROFILE)
            session.add(user_profile)
            session.commit()

            print("✅ Successfully populated the user_profile table.")

        except Exception as e:
            print(f"❌ An error occurred: {e}")
            session.rollback()


if __name__ == "__main__":
    populate_user_profile()
