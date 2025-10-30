# 🚀 Quick Setup Guide - Expense Tracker

Follow these steps to get your Expense Tracker app running locally.

---

## ✅ Step 1: Set Up Backend

### 1.1 Navigate to backend folder
```bash
cd backend
```

### 1.2 Install dependencies
```bash
npm install
```

### 1.3 Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_here
PORT=4000

# Optional: Add for AI-powered responses
OPENAI_API_KEY=sk-your-openai-key-here
```

**Getting MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<username>` and `<password>`

### 1.4 Start backend server
```bash
npm run dev
```

✅ Backend should now be running at `http://localhost:4000`

---

## ✅ Step 2: Set Up Frontend

### 2.1 Open a new terminal and navigate to frontend
```bash
cd frontend
```

### 2.2 Install dependencies
```bash
npm install
```

### 2.3 (Optional) Configure API URL
If your backend is NOT running on `localhost:4000`, create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE=http://localhost:4000
```

### 2.4 Start frontend dev server
```bash
npm run dev
```

✅ Frontend should now be running at `http://localhost:3000` (or 3002 if ports are in use)

---

## 🎯 Step 3: Test the Application

### 3.1 Open your browser
Navigate to the frontend URL (e.g., `http://localhost:3002`)

### 3.2 Create an account
1. Click "Sign Up"
2. Enter your name, email, and password
3. Click "Sign Up"

### 3.3 Add transactions
1. Use the form at the top of the Dashboard
2. Select expense/income type
3. Enter amount and category
4. Click "Add"

### 3.4 Chat with AI Assistant
1. Click "Chat Assistant" in the header
2. Try asking:
   - "How much did I spend on food?"
   - "What's my biggest expense category?"
   - "Give me a summary"

---

## 🔧 Common Issues

### ❌ Backend won't start
- **Problem**: `MONGO_URI not set in environment`
- **Solution**: Make sure you created `.env` file in `backend/` folder and added valid MongoDB URI

### ❌ Frontend can't connect to backend
- **Problem**: Network errors or CORS issues
- **Solution**: 
  - Ensure backend is running on port 4000
  - Check `VITE_API_BASE` in frontend `.env` if needed
  - Clear browser cache

### ❌ Chat not working
- **Problem**: AI responses not working
- **Solution**: 
  - Without OpenAI key: Only basic rule-based responses work
  - With OpenAI key: Set `OPENAI_API_KEY` in backend `.env`

---

## 📊 Project Structure

```
Expense-Tracker/
├── backend/                 # Express + MongoDB API
│   ├── src/
│   │   ├── models/         # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   └── Budget.js
│   │   └── routes/         # API endpoints
│   │       ├── auth.js     # Signup/Login
│   │       ├── transactions.js  # CRUD transactions
│   │       ├── budgets.js  # Budget management
│   │       └── chat.js     # AI assistant
│   ├── .env                # Your secrets (create this)
│   ├── .env.example        # Template
│   ├── package.json
│   └── server.js           # Entry point
│
├── frontend/               # React + Vite UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx       # Auth UI
│   │   │   ├── Dashboard.jsx   # Main view
│   │   │   ├── ExpenseForm.jsx # Add transactions
│   │   │   └── Chat.jsx        # AI chatbot
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── .env                # Optional config (create if needed)
│   ├── package.json
│   └── vite.config.js
│
├── README.md               # Full documentation
└── SETUP_GUIDE.md         # This file
```

---

## 🎉 Next Steps

Once everything is running:

1. **Add sample data**: Create some transactions to test the dashboard
2. **Test AI chat**: Ask questions about your spending
3. **Set budgets**: Use the API or extend the UI to add budget tracking
4. **Explore code**: Customize categories, add charts, improve styling

---

## 🤝 Need Help?

- Check `README.md` for full documentation
- Review backend routes in `backend/src/routes/`
- Review frontend components in `frontend/src/components/`

---

**Happy tracking! 💰**
