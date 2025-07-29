# 🧑💻 Contributing to Maverick

First of all, thank you for your interest in contributing to our JobBot - Maverick! Your help in building a better, smarter job agent and dashboard is greatly appreciated.

Below are the guidelines for contributing—please read them carefully before you start.

## 📋 Table of Contents

- [Types of Contributions](#types-of-contributions)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Best Practices](#best-practices)
- [Code of Conduct](#code-of-conduct)
- [Reporting Issues](#reporting-issues)
- [Pull Request Process](#pull-request-process)
- [Maintenance](#maintenance)

## Types of Contributions

You can contribute in many ways, including but not limited to:
- Bug fixes
- Feature improvements (agent logic, UI enhancements, database structure)
- Adding new target platforms or job boards
- Documentation (readmes, code comments, examples)
- Test coverage (unit and integration tests)
- Workflow improvements for CI/CD
## How to Contribute

1. **Fork the Repository**  
   Click “Fork” at the top right of this repo and clone your fork.

2. **Create a Feature Branch**  
   ```bash
   git checkout -b feature/short-description
   ```

3. **Set Up Your Local Environment**  
   - See [README.md](./README.md) for backend (`agent/`) and frontend (`frontend/`) setup.
   - Remember to copy `.env.example` and fill in the needed values.

4. **Make Your Changes**
   - For backend, activate your Python venv and use `uv sync`.
   - For frontend, use `npm install` and `npm run dev` to work on the dashboard.
   - Run tests locally!

5. **Commit with Good Messages**
   ```bash
   git commit -m "fix(agent): clarify job extraction fallback logic"
   git commit -m "feat(frontend): add match score filter to dashboard"
   ```

6. **Push Your Branch and Open a Pull Request**
   ```bash
   git push origin feature/short-description
   ```
   Open a PR on GitHub and describe **what you changed and why**.

## Development Setup

- Agent code: in `agent/`
- Dashboard frontend: in `frontend/`
- Use Playwright and GROQ for the agent; Next.js + Tailwind for the frontend.
- Add new dependencies to `pyproject.toml` (backend) or `package.json` (frontend) as appropriate.

**Python Agent:**
```bash
cd agent
python -m venv .venv
source .venv/bin/activate
pip install uv
uv sync
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Best Practices

- Use type hints and docstrings in Python.
- Use descriptive variable/function names.
- Keep functions small and purpose-driven.
- Write or update tests if possible (unit/integration).
- Update documentation where necessary.
- Separate logic: backend scraping agent, API/data model, frontend components, etc.

## Code of Conduct

Be respectful and inclusive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) for all interactions.

## Reporting Issues

- Use [GitHub Issues](https://github.com/ap-aditya/maverick/issues) for bugs, enhancements, and questions.
- For security concerns, please do NOT file a public issue. Instead, contact a maintainer directly.

## Pull Request Process

- Small, focused PRs are easier to review than large, all-in-one changes.
- Reference the issue your PR fixes with `Fixes #ISSUE_NUMBER` in the description.
- Ensure your branch is up to date with `main` before opening your PR.
- At least one maintainer will review and approve your changes.

## Maintenance

- The maintainers team reserves the right to edit/correct incoming contributions for style, documentation quality, and functional integration.
- After merging, your code may be refactored to adhere to project structure and style.

Thank you for making JobBot- Maverick better!  
Happy contributing 🚀

If you have any questions, feel free to open a Discussion or contact a maintainer.