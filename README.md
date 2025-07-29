# 🤖 Maverick: Your Personal AI Career Agent

MAverick is a comprehensive, autonomous system designed to automate the entire job search and application tracking process. It combines a powerful Python-based AI agent with a modern, interactive Next.js web dashboard to create a personalized career management cockpit.

The agent proactively scours the web for relevant job opportunities, performs a deep analysis against your personal profile, and saves the enriched data. The dashboard then provides a clean, intuitive interface to view these findings, track your application progress, and gain insights into your job hunt.

## ✨ Core Features

### 🤖 Backend Agent (`agent/`)

- **Automated Job Sourcing**: Scans multiple job boards and company career pages based on a simple `config.json` file.
- **Intelligent Data Extraction**: Uses LLMs (Groq) to understand page content, reliably extracting job listings and handling pagination without brittle selectors.
- **Personalized Fit Analysis**: For every new job, the agent scrapes the full description and compares it against your stored professional profile to generate:
  - A **Match Score** (1-10)
  - A concise **Match Summary**
  - Lists of **Matching & Missing Skills**
  - Extracted **Salary Range** and **Company Info**
- **Efficient Pre-Filtering**: Checks for duplicate jobs against the database before performing expensive analysis to save time and resources.
- **Scheduled & Autonomous**: A GitHub Actions workflow runs the agent automatically on a daily schedule, ensuring a continuous flow of new opportunities.

### 🌐 Frontend Dashboard (`frontend/`)

- **Secure Authentication**: A simple but secure password-protected login system to keep your dashboard private.
- **Interactive Dashboard**: Displays all discovered jobs in a clean card layout with prominent, color-coded match scores.
- **Powerful Filtering**: Instantly search and filter jobs by title, company, status, or minimum match score.
- **Detailed Job View**: A slide-out drawer shows the full AI analysis, including matching/missing skills and any extracted salary data.
- **On-Demand Resume Tailoring**: An AI-powered feature that generates a tailored professional summary and resume bullet points for any specific job you're interested in.
- **Spreadsheet-Style Application Tracker**: A robust data table to manage your application pipeline with customizable statuses (Interested, Applied, Interviewing, etc.) and an "Edit" feature.
- **Visual Analytics**: An analytics page with interactive charts, including an application pipeline and match score distribution, with date-range filtering.
- **Editable User Profile**: A dedicated page to view and update your professional profile, ensuring the agent's analysis is always based on your latest information.

## 📊 Performance & Scale

### Typical Daily Results
- **Sites Processed**: 25+ target URLs across MAANG, startups, and job boards
- **AI Analysis**: 1-10 match scoring with skill gap analysis
- **Execution Time**: 45-90 minutes for full cycle
- **Success Rate**: 85-95% (varies by site availability)

### Supported Platforms
- **MAANG**: Google, Meta, Amazon, Apple, Netflix, Microsoft
- **Indian Job Boards**: Naukri, Shine, Foundit, LinkedIn
- **Startups**: Wellfound, Y Combinator, Built In
- **Service Companies**: TCS, Infosys, Wipro, Accenture, IBM
- **Product Companies**: Adobe, Atlassian, Uber, Salesforce

## 🛠️ Tech Stack

| Area | Technology |
|------|------------|
| **Backend** | Python, LangGraph, SQLModel, Playwright, uv (Package Manager) |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Table, Recharts, Drizzle ORM |
| **AI/LLM** | Groq (Llama 3) for high-speed analysis and structured data extraction |
| **Database** | Neon (Serverless PostgreSQL) |
| **Deployment** | GitHub Actions (for the scheduled agent) & Vercel (for the frontend) |

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

#### Required
- **Python 3.11+** (recommended for optimal performance)
- **Node.js 24+** (for frontend dashboard)
- **PostgreSQL database** ([Neon](https://neon.tech) recommended)
- **GROQ API key** ([Get free key](https://console.groq.com))

#### Optional
- **Git** (for cloning and version control)

### 1. Clone the Repository

```bash
git clone https://github.com/ap-aditya/maverick
cd maverick
```

### 2. Backend Agent Setup (`agent/`)

The Python agent uses `uv` for package management.

```bash
# Navigate to the agent directory
cd agent

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install all dependencies (including Playwright) using uv
pip install uv
uv sync

# Set up environment variables
cp .env.example .env
```

Now, open `agent/.env` and fill in your `GROQ_API_KEY` and `DATABASE_URL`.

### 3. Frontend Dashboard Setup (`frontend/`)

```bash
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Open `frontend/.env.local` and fill in your credentials

### 4. Database Initialization

This is a one-time setup to create your database tables and populate your profile.

```bash
# From the agent/ directory (with virtual environment active)

# 1. Edit populate_profile.py with your professional info, then run it
python populate_profile.py
```

### 5. Configure Job Targets

The agent comes pre-configured with 25+ high-value targets. To customize:

```bash
# Edit config.json to add/remove job sites
nano config.json
```

### 6. Running the Application

You will need two separate terminal windows.

**Terminal 1 (Backend Agent):**
```bash
cd agent
source .venv/bin/activate
python main.py
```

**Terminal 2 (Frontend Dashboard):**
```bash
cd frontend
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000) to view the application.


## ☁️ Deployment

### Backend Agent (GitHub Actions)
The Python agent is designed to be run automatically via the GitHub Actions workflow defined in `.github/workflows/run_agent.yml`.

**Required Repository Secrets:**
- `GROQ_API_KEY`: Your GROQ API key
- `DATABASE_URL`: PostgreSQL connection string

**The workflow runs daily at 2:00 AM UTC (7:30 AM IST)**

### Frontend Dashboard (Vercel)
The Next.js frontend is designed to be deployed to Vercel.

**Deployment Steps:**
1. Connect your GitHub repository to Vercel
2. Set **Root Directory** to `frontend` in Vercel project settings
3. Add all necessary environment variables in Vercel dashboard
4. Deploy automatically on push to main branch


## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m 'Add: amazing feature'`
5. Push and create a Pull Request

### Development Guidelines
- Follow existing code style and formatting
- Update documentation for significant changes
- Test with multiple job sites before submitting
- Use type hints for Python code
- Follow React/TypeScript best practices for frontend

## 📈 Analytics & Insights

The dashboard provides comprehensive analytics including:

- **Application Pipeline**: Visual representation of your job application stages
- **Match Score Distribution**: Histogram of job match scores over time
- **Company Analysis**: Top companies with the most opportunities
- **Skill Gap Analysis**: Most frequently missing skills across jobs
- **Time-based Trends**: Job discovery patterns and application success rates

## 🔒 Privacy & Compliance

- **Respectful Scraping**: Implements delays and follows robots.txt guidelines
- **Data Privacy**: Only stores publicly available job information
- **Rate Limiting**: Prevents overwhelming target websites
- **User Agent**: Uses realistic browser headers
- **Secure Authentication**: Password-protected dashboard access
- **Data Encryption**: Secure handling of sensitive information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GROQ](https://groq.com/) for blazing-fast LLM inference
- [Playwright](https://playwright.dev/) for reliable web scraping
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Vercel](https://vercel.com/) for seamless frontend deployment
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components