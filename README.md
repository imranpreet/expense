# 💰 Expense Tracker - Full Stack Application

A comprehensive expense tracking application built with modern web technologies. Track your expenses, manage budgets, set savings goals, and get AI-powered insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 🌟 Features

### Core Features
- ✅ **Expense & Income Tracking** - Add, edit, delete transactions with categories
- 📊 **Visual Analytics** - Beautiful pie charts and bar graphs with dark color themes
- 💵 **Budget Management** - Set monthly/weekly budgets and track spending
- 🎯 **Savings Goals** - Create and monitor savings goals with progress tracking
- 🤖 **AI Assistant** - Get intelligent insights about your spending habits
- 🔔 **Smart Alerts** - Real-time notifications with sound when budget limits are reached
- 🌍 **Multi-Currency** - Support for 18+ currencies worldwide
- 🎨 **Theme Customization** - Light/Dark/Auto themes with custom color schemes

### UI/UX Features
- 🚀 **Beautiful Landing Page** - Modern, animated landing page with:
  - Animated stats that swap positions
  - Color-changing effects
  - Smooth fade-in animations
  - Interactive hover effects
  - Comprehensive FAQ section
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Auto-refresh for budget calculations
- 🎯 **Intuitive Navigation** - Clean and user-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful, responsive charts
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/imranpreet/expense.git
cd expense
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_secret_key_here_change_this_in_production
```

Start the backend server:
```bash
node server.js
```

The backend will run on `http://localhost:4000`

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and visit: `http://localhost:3000`

**Test Credentials:**
- Email: `test@test.com`
- Password: `123456`

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── models/           # MongoDB models
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   ├── Budget.js
│   │   │   └── SavingsGoal.js
│   │   └── routes/           # API routes
│   │       ├── auth.js
│   │       ├── transactions.js
│   │       ├── budgets.js
│   │       ├── savingsGoals.js
│   │       └── chat.js
│   ├── server.js             # Express app setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── SavingsGoal.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx           # Main app component
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🎨 Features in Detail

### 1. Dashboard
- Overview of income and expenses
- Visual analytics with pie charts and bar graphs
- Recent transactions list
- Quick stats (balance, income, expenses)

### 2. Budget Planner
- Create budgets with custom periods (weekly/monthly/custom)
- Real-time tracking of spent vs. budget
- Visual progress bars
- Smart alerts when nearing limits

### 3. Savings Goals
- Set savings targets with deadlines
- Track progress with visual indicators
- Calculate required monthly savings
- Motivational progress display

### 4. AI Assistant
- Get spending insights
- Ask questions about your finances
- Receive personalized recommendations
- Interactive chat interface

### 5. Settings
- Choose from 18+ currencies
- Toggle theme (Light/Dark/Auto)
- Persistent preferences
- User profile management

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions/user/:userId` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets/user/:userId` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Savings Goals
- `GET /api/savingsGoals/user/:userId` - Get all savings goals
- `POST /api/savingsGoals` - Create savings goal
- `PUT /api/savingsGoals/:id` - Update savings goal
- `DELETE /api/savingsGoals/:id` - Delete savings goal

### AI Chat
- `POST /api/chat` - Send message to AI assistant

## 🎨 Color Themes

### Dark Color Scheme (Default)
- Food: Dark Red `#DC2626`
- Transport: Dark Blue `#2563EB`
- Shopping: Dark Purple `#7C3AED`
- Entertainment: Dark Orange `#EA580C`
- Bills: Dark Green `#059669`
- Healthcare: Dark Pink `#DB2777`
- Education: Dark Cyan `#0891B2`
- Other: Dark Slate Gray `#475569`

## 🔧 Configuration

### MongoDB Connection
Update `MONGODB_URI` in backend `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
```

### Port Configuration
- Backend: Default `4000` (configurable in `.env`)
- Frontend: Default `3000` (configurable in `vite.config.js`)

## 📝 Scripts

### Backend
```bash
npm start          # Start the server
node server.js     # Start manually
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Kill process on port 4000
lsof -i :4000
kill -9 <PID>
```

### Dependencies Issues
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Imran Preet**
- GitHub: [@imranpreet](https://github.com/imranpreet)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Recharts for beautiful chart components
- MongoDB for the flexible database solution
- All open-source contributors

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by Imran Preet
