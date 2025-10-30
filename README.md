# 💰 Expense Tracker App with AI Chatbot Assistant

A full-stack expense tracking application with an integrated AI-powered finance assistant that helps you track spending, manage budgets, and get personalized financial advice through natural conversation.

**✨ Now featuring a modern UI built with Tailwind CSS!** — Beautiful gradients, smooth animations, and fully responsive design. See [UI_FEATURES.md](./UI_FEATURES.md) for details.

---

## 🚀 Features

### 🧾 Core Features
- **Expense & Income Management**: Record and categorize transactions
- **Budget Tracking**: Set monthly/weekly budgets with alerts
- **Analytics Dashboard**: View spending summaries and trends
- **AI Chatbot Assistant**: Get real-time financial insights and advice
  - Natural language queries like "How much did I spend on food this month?"
  - Data-driven responses based on your actual transactions
  - Personalized saving tips and recommendations
  - Budget alerts and spending pattern analysis

### 🤖 AI Chatbot Capabilities
The integrated assistant can:
- Answer spending queries using your real transaction data
- Identify your biggest expense categories
- Provide spending summaries and trends
- Offer personalized financial advice (when OpenAI API key is configured)
- Help you understand and improve your spending habits

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js (Vite) | Responsive UI and chatbot interface |
| **Styling** | Tailwind CSS | Modern, gradient-based design system |
| **Backend** | Node.js + Express | REST API and business logic |
| **Database** | MongoDB | Store users, transactions, budgets |
| **Charts** | Recharts | Visualize spending patterns |
| **AI** | OpenAI GPT (optional) | Enhanced chatbot responses |
| **Auth** | JWT + bcryptjs | Secure authentication |

---

## 📂 Project Structure

```
Expense-Tracker/
├── backend/                # Express API server
│   ├── src/
│   │   ├── models/        # Mongoose schemas (User, Transaction, Budget)
│   │   └── routes/        # API routes (auth, transactions, budgets, chat)
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/               # React Vite app
│   ├── src/
│   │   ├── components/    # React components (Dashboard, Chat, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- (Optional) OpenAI API key for enhanced AI responses

### 1️⃣ Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MONGO_URI and JWT_SECRET
```

**Required Environment Variables (`.env`):**
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expense-db
JWT_SECRET=your_secret_key_here
PORT=4000

# Optional: For AI-powered responses
OPENAI_API_KEY=sk-...
```

**Start the backend:**
```bash
npm run dev
```
Backend will run at `http://localhost:4000`

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install

# (Optional) Create .env if backend is not on localhost:4000
cp .env.example .env
# Add: VITE_API_BASE=http://localhost:4000
```

**Start the frontend:**
```bash
npm run dev
```
Frontend will run at `http://localhost:3000` (or next available port)

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email/password

### Transactions
- `POST /api/transactions` - Add new transaction
- `GET /api/transactions/user/:userId` - Get user transactions
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `POST /api/budgets` - Set budget for category
- `GET /api/budgets/user/:userId` - Get user budgets

### AI Chat
- `POST /api/chat/query` - Send message to AI assistant
  ```json
  {
    "userId": "user_id_here",
    "message": "How much did I spend on food this month?"
  }
  ```

---

## 💬 Using the AI Assistant

The chatbot provides **data-driven responses** to avoid hallucinations:

**Basic Mode (No API Key)**
- Uses rule-based logic with your real transaction data
- Answers: spending by category, biggest expenses, summaries
- Example: "You've spent ₹4200 on food so far this month."

**Enhanced Mode (With OpenAI API Key)**
- Combines your data with GPT intelligence
- Natural conversation and personalized advice
- Financial tips and budget recommendations

**Sample Queries:**
- "How much did I spend on entertainment this month?"
- "What's my biggest expense category?"
- "Show me a spending summary"
- "Give me a savings tip"

---

## 🔐 Security Best Practices

✅ **Environment Variables**: Never commit `.env` files  
✅ **JWT Authentication**: Secure token-based auth  
✅ **Data Privacy**: AI responses use only your data  
✅ **Password Hashing**: bcryptjs for secure storage  

---

## 🚢 Deployment

### Backend (Render / Railway / Google Cloud)
1. Create new web service
2. Connect GitHub repo
3. Set environment variables (MONGO_URI, JWT_SECRET, OPENAI_API_KEY)
4. Deploy from `backend/` folder

### Frontend (Vercel / Netlify)
1. Create new site
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add env variable: `VITE_API_BASE=<your-backend-url>`

---

## 🎯 Future Enhancements

- 🎤 Voice assistant integration
- 📈 Predictive spending alerts
- 🏷️ Smart auto-categorization
- 📊 Advanced data visualization (Recharts integration)
- 🎯 Goal-based savings automation
- 📧 Email notifications for budget limits

---

## 📝 Notes

- The app uses a **dummy userId** stored in localStorage for demo purposes
- For production, implement proper authentication middleware
- AI responses are based on real user data to ensure accuracy
- Without an OpenAI API key, the chatbot uses basic rule-based responses

---

## 🤝 Contributing

This project was built as a full-stack demonstration of React + Node.js + MongoDB + AI integration.

---

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

**Built with ❤️ using React, Node.js, MongoDB, and OpenAI**
