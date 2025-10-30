# 🚀 Quick Start Guide

This guide will get your Expense Tracker up and running in under 5 minutes!

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier works great)

## Step 1: Set Up MongoDB (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier is perfect)
4. Click "Connect" → "Connect your application"
5. Copy your connection string (looks like: `mongodb+srv://username:password@cluster0.mongodb.net/`)

## Step 2: Configure Backend (1 minute)

```bash
cd backend
cp .env.example .env
nano .env  # or use your favorite editor
```

Update your `.env` file:
```bash
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/expense-tracker?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=your_random_secret_key_minimum_32_characters_long
OPENAI_API_KEY=  # Optional - leave empty for basic chatbot
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Configure Frontend (30 seconds)

```bash
cd ../frontend
cp .env.example .env
nano .env
```

Update your `.env` file:
```bash
VITE_API_BASE=http://localhost:4000
```

## Step 4: Install Dependencies & Run (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```

You should see:
```
Connected to MongoDB
Server running on port 4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:3002/
```

## Step 5: Open Your Browser

Navigate to: **http://localhost:3002/**

You should see:
1. 🎉 **Landing Page** with a beautiful hero section
2. Click "Get Started" to go to login
3. **Sign Up** for a new account
4. Start tracking expenses!

## ✅ Quick Test

After signing up, you should be able to:
- ✨ Add new expenses/income
- 📊 View your dashboard with stats
- 💬 Chat with the AI assistant
- 📈 Track your spending categories

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Check if MongoDB connection string is correct
cd backend
cat .env
# Make sure MONGO_URI starts with mongodb+srv://
```

### Frontend shows connection errors?
```bash
# Make sure backend is running first!
# Check frontend .env has correct backend URL
cd frontend
cat .env
# Should be: VITE_API_BASE=http://localhost:4000
```

### Port already in use?
```bash
# Frontend automatically tries ports 3000, 3001, 3002...
# Backend: Change PORT in backend/.env
```

## 🎯 Next Steps

- Customize the theme in `frontend/tailwind.config.js`
- Add OpenAI API key for advanced AI features
- Deploy to production (see DEPLOYMENT.md)
- Check out all features in UI_FEATURES.md

## 💡 Need Help?

- Check README.md for detailed documentation
- Review SETUP_GUIDE.md for advanced configuration
- See UI_FEATURES.md for all available features

---

**Enjoy tracking your expenses! 💰✨**
