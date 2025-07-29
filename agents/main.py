from app.graph import app
from app.database import create_db_and_tables
import time


def main():
    start_time = time.time()

    create_db_and_tables()

    print("🚀 Starting JobBot Agent - Production Mode")
    print("🎯 Target: Entry-level and internship positions in India")

    config = {"recursion_limit": 200, "max_execution_time": 7200}

    try:
        result = app.invoke({}, config=config)

        execution_time = time.time() - start_time
        print(f"\n✅ JobBot execution completed successfully")
        print(f"⏱️ Total execution time: {execution_time:.2f} seconds")
        print(
            f"📊 Check database for new opportunities across MAANG, product, service, and startup companies"
        )

    except Exception as e:
        execution_time = time.time() - start_time
        print(f"\n❌ JobBot execution failed after {execution_time:.2f} seconds")
        print(f"🔍 Error: {str(e)}")


if __name__ == "__main__":
    main()
