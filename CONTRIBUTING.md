# Contributing to Expense Tracker

First off, thank you for considering contributing to Expense Tracker! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure your code follows the existing style
4. Make sure your code lints
5. Write a convincing description of your PR

## Development Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- Git

### Setup Steps

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/expense.git
cd expense
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Set up environment variables**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your settings
```

4. **Start development servers**
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Coding Style

### JavaScript/React
- Use ES6+ features
- Follow the existing code style
- Use meaningful variable names
- Comment complex logic
- Keep components small and focused

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

Examples:
```
Add multi-currency support for EUR

- Implement currency conversion API
- Update transaction model
- Add currency selector in settings
Fixes #123
```

## Project Structure

```
expense-tracker/
├── backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── models/   # MongoDB schemas
│   │   └── routes/   # API endpoints
│   └── server.js     # Entry point
│
└── frontend/         # React frontend
    └── src/
        ├── components/  # React components
        ├── App.jsx     # Main app
        └── index.css   # Styles
```

## Testing

Before submitting a pull request, make sure:
- All existing tests pass
- New features have corresponding tests
- The application runs without errors
- The UI is responsive and works on mobile

## Areas for Contribution

Here are some areas where contributions are especially welcome:

### Features
- [ ] Export transactions to CSV/PDF
- [ ] Recurring transactions
- [ ] Receipt image upload
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Advanced analytics and reports

### Improvements
- [ ] Performance optimization
- [ ] Better error handling
- [ ] Improved accessibility (WCAG compliance)
- [ ] Internationalization (i18n)
- [ ] Unit and integration tests
- [ ] API documentation (Swagger/OpenAPI)

### Bug Fixes
- Check the [issues](https://github.com/imranpreet/expense/issues) page for known bugs

## Questions?

Feel free to open an issue with your question or contact the maintainers.

## Recognition

Contributors will be recognized in the README.md file and in release notes.

Thank you for contributing! 🎉
