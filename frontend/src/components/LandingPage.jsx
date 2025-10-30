import React, { useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function LandingPage({ onGetStarted }) {
  const [showDemo, setShowDemo] = useState(false);
  const [currentDemoStep, setCurrentDemoStep] = useState(0);
  const [loadedSections, setLoadedSections] = useState({ pricing: true, footer: true });
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureAnswers, setFeatureAnswers] = useState({ answer1: '', answer2: '' });
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [paymentData, setPaymentData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card'
  });

  const demoSteps = [
    {
      title: "Expense Tracking & Budget Management",
      description: "Master the art of expense tracking with our intuitive platform. Record every transaction in seconds with smart categorization. Set realistic monthly budgets for each spending category and get real-time notifications when you're approaching your limits. Our system automatically organizes your spending into categories like Food, Transport, Shopping, and more. Watch your savings grow as you stay within budget!",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      summary: "Learn how to efficiently track all your expenses with automatic categorization, receipt management, and smart budget planning. This video demonstrates the quick-entry system and budget alerts that help you save money while maintaining accurate financial records.",
      features: ["⚡ Quick 3-second entry", "🏷️ Auto-categorization", "📊 Category-based budgets", "🔔 Real-time alerts"]
    },
    {
      title: "AI-Powered Insights & Analytics Dashboard",
      description: "Meet your personal AI financial advisor! Our advanced machine learning algorithms analyze your spending patterns and provide personalized recommendations. Visualize your financial journey with stunning, interactive charts and comprehensive reports. View income vs expenses with beautiful pie charts, track spending trends over time, and get proactive alerts about unusual spending. Make data-driven financial decisions with ease!",
      videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
      summary: "Experience the power of artificial intelligence combined with visual analytics. This demo shows how AI analyzes your data to provide actionable insights, predict future expenses, and help you make informed financial decisions using interactive charts and reports.",
      features: ["🤖 AI chat assistant", "🧠 Pattern recognition", "📊 Interactive charts", "� Progress visualization"]
    }
  ]

  const nextDemoStep = () => {
    if (currentDemoStep < demoSteps.length - 1) {
      setCurrentDemoStep(currentDemoStep + 1)
    }
  }

  const prevDemoStep = () => {
    if (currentDemoStep > 0) {
      setCurrentDemoStep(currentDemoStep - 1)
    }
  }

  const closeDemoModal = () => {
    setShowDemo(false)
    setCurrentDemoStep(0)
  }

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqData = [
    {
      question: "What is the main purpose of your Expense Tracker project?",
      answer: "Our Expense Tracker is designed to empower users with complete financial control and awareness. The main purpose is to help individuals and families track their daily expenses, manage budgets effectively, and achieve their financial goals. It provides real-time insights into spending patterns, categorizes transactions automatically, and offers AI-powered recommendations to optimize your financial health. Whether you're saving for a dream vacation, paying off debt, or simply want to understand where your money goes, our tracker makes financial management simple, intuitive, and actionable."
    },
    {
      question: "Which technologies and tools did you use for the frontend, backend, and database?",
      answer: "Our Expense Tracker is built with modern, industry-standard technologies:\n\n**Frontend:** React 18 with Vite for lightning-fast development and optimal performance. We use Tailwind CSS for beautiful, responsive UI design, Recharts for interactive data visualizations, and Axios for seamless API communication.\n\n**Backend:** Node.js with Express.js framework for robust server-side logic. We implement JWT (JSON Web Tokens) for secure authentication, bcrypt for password encryption, and RESTful API architecture for scalable data management.\n\n**Database:** MongoDB, a flexible NoSQL database that efficiently stores user data, transactions, budgets, and savings goals. We use Mongoose ODM for elegant data modeling and validation.\n\n**Additional Tools:** Web Audio API for alert sounds, browser notifications for budget warnings, and localStorage for theme and currency preferences."
    },
    {
      question: "How does the user add, edit, and delete expenses or income?",
      answer: "Adding, editing, and deleting transactions is incredibly simple:\n\n**Adding Transactions:**\n1. Click the '+ Add Transaction' button on the Dashboard\n2. Select transaction type (Income or Expense)\n3. Choose a category (Food, Transport, Shopping, etc.)\n4. Enter the amount\n5. Add optional description and date\n6. Click Save - transaction appears instantly!\n\n**Editing Transactions:**\nCurrently, users can view all transaction details. Edit functionality is in development and will allow inline editing with a simple click.\n\n**Deleting Transactions:**\n1. Find the transaction in your list\n2. Click the delete icon (trash can)\n3. Confirm deletion\n4. Transaction is removed immediately and all calculations update automatically\n\nAll changes are reflected in real-time across all charts, budgets, and summaries!"
    },
    {
      question: "How do you calculate and display total income, total expenses, and remaining balance?",
      answer: "Our calculation system is transparent, accurate, and real-time:\n\n**Total Income:** We sum all transactions marked as 'income' (salary, freelance, investments, gifts, etc.)\n\n**Total Expenses:** We sum all transactions marked as 'expense' across all categories (food, transport, shopping, etc.)\n\n**Remaining Balance:** Calculated as Total Income - Total Expenses\n\n**Visual Display:**\n- Dashboard shows three beautiful cards with color-coded indicators\n- Green for positive balance, orange for low balance, red for negative\n- Animated progress bars show spending vs income\n- Interactive pie charts break down expenses by category\n- Bar charts compare monthly income vs expenses\n- Real-time updates every 5 seconds ensure you always see current data\n\n**Smart Features:**\n- Negative balance triggers audio and visual alerts\n- Budget tracking shows how much you've spent vs your limits\n- Percentage indicators show if you're on track with your budget\n- All amounts display in your preferred currency (18 currencies supported!)"
    },
    {
      question: "What features make your project dynamic or different from a basic tracker?",
      answer: "Our Expense Tracker goes far beyond basic tracking with these innovative features:\n\n**1. AI Financial Assistant:** Chat with our AI to get personalized financial advice, spending analysis, and budget recommendations.\n\n**2. Smart Budget System:** Create category-based budgets that automatically track your spending and send alerts when you're approaching limits.\n\n**3. Continuous Alert System:** When balance goes negative, a continuous audio alert plays until you manually stop it - you won't miss important warnings!\n\n**4. Auto-Scrolling Interface:** Smooth, infinite auto-scrolling sections for better user experience.\n\n**5. Interactive Feature Modals:** Click on feature boxes to learn more and answer questions about your financial goals.\n\n**6. Theme Customization:** Toggle between dark (slate/blue) and light (purple/pink) themes.\n\n**7. Multi-Currency Support:** Choose from 18 global currencies with real-time symbol updates.\n\n**8. Savings Goals:** Set and track multiple savings goals with visual progress indicators.\n\n**9. Real-Time Updates:** Data refreshes every 5 seconds across all components.\n\n**10. Beautiful Visualizations:** Dark, vibrant graph colors for better data visibility.\n\n**11. Period-Based Budgets:** Create weekly, monthly, quarterly, or yearly budgets that auto-calculate date ranges.\n\n**12. Responsive Design:** Works perfectly on desktop, tablet, and mobile devices."
    },
    {
      question: "How is user data stored and secured in your database?",
      answer: "Security and privacy are our top priorities:\n\n**Data Storage:**\n- All user data is stored in MongoDB with structured schemas\n- Each user has a unique ID that links their transactions, budgets, and goals\n- Data is organized in separate collections: Users, Transactions, Budgets, and Savings Goals\n- Timestamps track when data was created and modified\n\n**Security Measures:**\n\n**1. Password Protection:**\n- Passwords are hashed using bcrypt (10 salt rounds)\n- Plain text passwords are never stored\n- Even administrators cannot see your actual password\n\n**2. Authentication:**\n- JWT (JSON Web Tokens) for secure session management\n- Tokens expire automatically for added security\n- Each request is validated before processing\n\n**3. Data Isolation:**\n- Users can only access their own data\n- All API calls verify user ID ownership\n- Cross-user data leakage is prevented by design\n\n**4. Input Validation:**\n- All inputs are validated and sanitized\n- Protection against SQL injection and XSS attacks\n- Mongoose schema validation ensures data integrity\n\n**5. HTTPS Ready:**\n- Application is prepared for SSL/TLS encryption\n- Sensitive data transmission is protected\n\n**6. Local Storage:**\n- Only non-sensitive preferences (theme, currency) stored locally\n- No passwords or financial data in browser storage\n\n**Future Plans:**\n- Two-factor authentication (2FA)\n- End-to-end encryption for sensitive data\n- Regular security audits"
    },
    {
      question: "What challenges did you face while developing this project, and how did you solve them?",
      answer: "Development brought several interesting challenges:\n\n**Challenge 1: Budget Calculation Accuracy**\n*Problem:* Budget wasn't tracking actual transaction spending correctly\n*Solution:* Implemented smart date range calculation based on period types (weekly/monthly/quarterly/yearly) with case-insensitive category matching and automatic current period detection.\n\n**Challenge 2: Continuous Alert System**\n*Problem:* Users needed persistent warnings for negative balance\n*Solution:* Created a continuous beeping system with manual stop button, using Web Audio API to generate sounds and setInterval for repetition.\n\n**Challenge 3: Real-Time Updates**\n*Problem:* Users had to manually refresh to see budget changes\n*Solution:* Implemented auto-refresh every 5 seconds for both transactions and budgets, ensuring all components stay in sync.\n\n**Challenge 4: Theme Synchronization**\n*Problem:* Theme changes in Settings weren't reflecting across all components\n*Solution:* Added polling mechanism (500ms) to check localStorage for theme changes across all components.\n\n**Challenge 5: Currency Consistency**\n*Problem:* Currency symbols needed to update globally\n*Solution:* Centralized currency management in localStorage with dynamic symbol injection across all financial displays.\n\n**Challenge 6: Date Range Handling**\n*Problem:* Budgets with no dates used incorrect default ranges\n*Solution:* Implemented period-specific date calculations (current week/month/quarter/year) that automatically adjust based on budget type.\n\n**Challenge 7: Graph Visibility**\n*Problem:* Light pastel colors made graphs hard to read\n*Solution:* Switched to dark, vibrant colors (red for expenses, green for income) with high contrast for professional appearance.\n\n**Challenge 8: User Data Testing**\n*Problem:* Needed test data for demonstration\n*Solution:* Created automated test data scripts that generate complete user accounts with transactions and budgets.\n\n**Lessons Learned:**\n- Always validate user input thoroughly\n- Real-time updates improve user experience significantly\n- Clear console logging helps with debugging\n- Period-based calculations need careful date handling\n- User feedback is essential for feature refinement"
    }
  ]

  const closeAIModal = () => {
    setShowAIModal(false)
  }

  const handleContactSales = (planName, planPrice) => {
    setSelectedPlan({ name: planName, price: planPrice })
    setShowPaymentAlert(true)
    
    // Auto hide after 10 seconds
    setTimeout(() => {
      setShowPaymentAlert(false)
    }, 10000)
  }

  const closePaymentAlert = () => {
    setShowPaymentAlert(false)
    setSelectedPlan(null)
  }

  const handleProceedToPayment = () => {
    setShowPaymentAlert(false)
    setShowPaymentForm(true)
  }

  const closePaymentForm = () => {
    setShowPaymentForm(false)
    setPaymentData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      paymentMethod: 'card'
    })
  }

  // Feature data with detailed information and questions
  const featuresData = [
    { 
      icon: "📊", 
      title: "Smart Analytics", 
      desc: "Visualize your spending patterns with beautiful charts and graphs. Get instant insights into where your money goes.",
      color: "from-blue-400 to-cyan-400",
      detailedInfo: "Smart Analytics provides you with comprehensive visual insights into your financial behavior. Our advanced charting system uses pie charts, bar graphs, and line charts to show spending patterns across different time periods. You can view daily, weekly, monthly, or yearly trends. The system automatically categorizes your expenses and presents them in an easy-to-understand format. Compare your spending across different months, identify your biggest expense categories, and track your progress towards financial goals. With real-time data updates and interactive charts, you'll always know exactly where your money is going.",
      questions: [
        { id: 1, text: "What is your current biggest expense category?" },
        { id: 2, text: "How often would you like to review your spending analytics?" }
      ]
    },
    { 
      icon: "🎯", 
      title: "Budget Management", 
      desc: "Set custom budgets for different categories. Real-time tracking helps you stay on track with your financial goals.",
      color: "from-purple-400 to-pink-400",
      detailedInfo: "Budget Management gives you complete control over your spending limits. Create custom budgets for each expense category like groceries, transportation, entertainment, and utilities. Set monthly, weekly, or custom period budgets. The system tracks your spending in real-time and shows you exactly how much of your budget remains. Get visual progress bars for each category, receive alerts when you're approaching limits, and analyze which categories need budget adjustments. You can also set savings goals and track your progress. The budget rollover feature allows unused budget amounts to carry forward to the next period, helping you save more effectively.",
      questions: [
        { id: 1, text: "What monthly budget amount would help you save more?" },
        { id: 2, text: "Which expense category do you find hardest to control?" }
      ]
    },
    { 
      icon: "🤖", 
      title: "AI Assistant", 
      desc: "Chat with your personal AI financial advisor. Get personalized recommendations and answers to your money questions.",
      color: "from-green-400 to-teal-400",
      detailedInfo: "The AI Assistant is your personal financial advisor available 24/7. Powered by advanced machine learning algorithms, it analyzes your complete financial history to provide personalized recommendations. Ask questions like 'How can I save more money?' or 'Where am I overspending?' and get intelligent, data-driven answers. The AI learns from your spending patterns and suggests ways to optimize your budget. It can predict future expenses based on historical data, recommend budget adjustments, identify unusual spending patterns, and even suggest the best times to make large purchases. The conversational interface makes it easy to get financial insights without navigating complex menus.",
      questions: [
        { id: 1, text: "What financial goal would you like AI help to achieve?" },
        { id: 2, text: "What's your biggest financial challenge right now?" }
      ]
    },
    { 
      icon: "🔔", 
      title: "Smart Alerts", 
      desc: "Receive notifications when you're close to budget limits or when unusual spending is detected.",
      color: "from-orange-400 to-red-400",
      detailedInfo: "Smart Alerts keeps you informed about your financial activities in real-time. Get instant notifications when you approach or exceed budget limits for any category. The system detects unusual spending patterns - like a sudden large expense or spending in an uncommon category - and alerts you immediately. Set custom alert thresholds for different categories. Receive reminders for upcoming bill payments, subscription renewals, and savings goal milestones. Choose your notification preferences: email, SMS, or in-app notifications. The smart alerting system learns your spending patterns over time and becomes more accurate at detecting anomalies. You can also set up alerts for positive achievements like reaching savings goals or staying under budget.",
      questions: [
        { id: 1, text: "What type of alerts would be most helpful for you?" },
        { id: 2, text: "At what percentage of budget would you like to be notified?" }
      ]
    },
    { 
      icon: "📱", 
      title: "Multi-Device Sync", 
      desc: "Access your data anywhere, anytime. Seamlessly sync across all your devices in real-time.",
      color: "from-indigo-400 to-purple-400",
      detailedInfo: "Multi-Device Sync ensures your financial data is always accessible and up-to-date across all your devices. Use the app on your phone, tablet, laptop, or desktop computer - all data syncs automatically in real-time. Add an expense on your phone during lunch, and it's instantly available on your laptop at home. The cloud-based synchronization is fast, secure, and happens in the background. Your expense categories, budgets, goals, and transaction history are always in sync. Even offline, you can add transactions which will sync automatically when you're back online. The system maintains version history, so you never lose data. Perfect for families who want to share financial tracking across multiple family members' devices.",
      questions: [
        { id: 1, text: "How many devices do you typically use for financial management?" },
        { id: 2, text: "Would you like to share financial data with family members?" }
      ]
    },
    { 
      icon: "🔒", 
      title: "Bank-Level Security", 
      desc: "Your data is encrypted and secure. We use industry-leading security practices to protect your information.",
      color: "from-pink-400 to-rose-400",
      detailedInfo: "Bank-Level Security ensures your financial data is protected with military-grade encryption. All data is encrypted both in transit (using SSL/TLS) and at rest (using AES-256 encryption). We implement multi-factor authentication (MFA) for account access, ensuring only you can access your financial information. Regular security audits and penetration testing keep our systems secure. We comply with international data protection standards including GDPR and SOC 2. Your sensitive information like card details are tokenized and never stored in plain text. Automatic session timeout prevents unauthorized access if you leave your device unattended. We also provide account activity logs so you can monitor all access to your account. Our infrastructure is hosted on enterprise-grade servers with 24/7 monitoring and automatic backup systems.",
      questions: [
        { id: 1, text: "What security feature is most important to you?" },
        { id: 2, text: "Have you ever experienced a data breach with financial apps?" }
      ]
    }
  ]

  const openFeatureModal = (feature) => {
    setSelectedFeature(feature)
    setShowFeatureModal(true)
    setFeatureAnswers({ answer1: '', answer2: '' })
  }

  const closeFeatureModal = () => {
    setShowFeatureModal(false)
    setSelectedFeature(null)
    setFeatureAnswers({ answer1: '', answer2: '' })
  }

  const handleFeatureAnswerSubmit = (e) => {
    e.preventDefault()
    alert(`Thank you for your feedback!\n\nFeature: ${selectedFeature.title}\n\nQuestion 1: ${selectedFeature.questions[0].text}\nAnswer: ${featureAnswers.answer1}\n\nQuestion 2: ${selectedFeature.questions[1].text}\nAnswer: ${featureAnswers.answer2}\n\nYour responses help us improve our service!`)
    closeFeatureModal()
  }

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    
    // Validate all fields
    if (!paymentData.fullName || !paymentData.email || !paymentData.phone) {
      alert('Please fill all required fields')
      return
    }

    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        alert('Please fill all card details')
        return
      }
    }

    // Simulate payment processing
    alert('🎉 Payment Successful! Your ' + selectedPlan.name + ' plan has been activated. Redirecting to Sign In page...')
    
    // Close payment form and redirect to sign in
    closePaymentForm()
    setSelectedPlan(null)
    
    // Redirect to sign in page after 2 seconds
    setTimeout(() => {
      onGetStarted()
    }, 2000)
  }

  // Intersection Observer for scroll animations
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            // Also add to visibleSections set
            if (entry.target.id) {
              setVisibleSections(prev => new Set([...prev, entry.target.id]));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', income: 45000, expenses: 32000 },
    { month: 'Feb', income: 48000, expenses: 35000 },
    { month: 'Mar', income: 52000, expenses: 38000 },
    { month: 'Apr', income: 50000, expenses: 36000 }
  ]

  const categoryData = [
    { name: 'Food', value: 12000, color: '#FFB4B4' },
    { name: 'Transport', value: 8000, color: '#B4D4FF' },
    { name: 'Shopping', value: 15000, color: '#C5A9E8' },
    { name: 'Bills', value: 10000, color: '#A8E6CF' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="px-6 py-5 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ExpenseTracker
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-600 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-purple-600 transition-colors">Reviews</a>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6 cursor-pointer hover:bg-purple-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                   onClick={() => setShowAIModal(true)}>
                ✨ AI-Powered Financial Management
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight animate-gradient-text">
                Take Control of Your
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg"> Finances </span>
                Effortlessly
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Track expenses, set budgets, and get AI-powered insights to achieve your financial goals. 
                Simple, smart, and secure expense management for everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Start Free Trial
                </button>
                <button 
                  onClick={() => setShowDemo(true)}
                  className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                  </svg>
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-8 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Monthly Overview</h3>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    +₹14,000
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line type="monotone" dataKey="income" stroke="#16A34A" strokeWidth={3} />
                    <Line type="monotone" dataKey="expenses" stroke="#DC2626" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6 bg-white/50 backdrop-blur-sm overflow-hidden fade-in-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6 hover:scale-110 transition-all duration-500 hover:shadow-2xl rounded-2xl hover:bg-white group animate-swap-1">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-color-change animate-float">
                10K+
              </div>
              <div className="text-gray-600 font-medium group-hover:text-purple-600 transition-colors">Active Users</div>
            </div>
            <div className="p-6 hover:scale-110 transition-all duration-500 hover:shadow-2xl rounded-2xl hover:bg-white group animate-swap-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-2 animate-color-change animate-float">
                ₹100Cr+
              </div>
              <div className="text-gray-600 font-medium group-hover:text-green-600 transition-colors">Money Managed</div>
            </div>
            <div className="p-6 hover:scale-110 transition-all duration-500 hover:shadow-2xl rounded-2xl hover:bg-white group animate-swap-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent mb-2 animate-color-change animate-float">
                4.9/5
              </div>
              <div className="text-gray-600 font-medium group-hover:text-orange-600 transition-colors">User Rating</div>
            </div>
            <div className="p-6 hover:scale-110 transition-all duration-500 hover:shadow-2xl rounded-2xl hover:bg-white group animate-swap-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 animate-color-change animate-float">
                24/7
              </div>
              <div className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-6 fade-in-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg animate-text-shadow">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you take control of your finances and achieve your goals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuresData.map((feature, i) => (
              <div 
                key={i} 
                onClick={() => openFeatureModal(feature)}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-300 hover:-translate-y-3 cursor-pointer hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transform"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">{feature.desc}</p>
                <p className="text-purple-600 font-semibold mt-4 text-sm group-hover:translate-x-2 transition-transform inline-block">Click to learn more →</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works - Auto Scrolling */}
      <div id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-purple-100/50 to-pink-100/50 overflow-hidden fade-in-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg animate-text-shadow">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and take control of your finances today
            </p>
          </div>
          
          {/* Auto-scrolling container */}
          <div className="relative">
            <div className="flex animate-scroll-infinite hover:pause">
              {/* First set of items */}
              {[
                { step: "1", title: "Sign Up", desc: "Create your free account in seconds. No credit card required.", icon: "✍️" },
                { step: "2", title: "Add Transactions", desc: "Manually enter or import your expenses and income.", icon: "💳" },
                { step: "3", title: "Set Budgets", desc: "Create budgets for different categories to track your spending.", icon: "🎯" },
                { step: "4", title: "Get Insights", desc: "Receive AI-powered insights and recommendations to save more.", icon: "💡" }
              ].map((item, i) => (
                <div key={i} className="flex-shrink-0 w-80 mx-4 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl">
                      {item.step}
                    </div>
                    <div className="absolute top-10 left-1/2 transform translate-x-1/2 text-4xl">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[
                { step: "1", title: "Sign Up", desc: "Create your free account in seconds. No credit card required.", icon: "✍️" },
                { step: "2", title: "Add Transactions", desc: "Manually enter or import your expenses and income.", icon: "💳" },
                { step: "3", title: "Set Budgets", desc: "Create budgets for different categories to track your spending.", icon: "🎯" },
                { step: "4", title: "Get Insights", desc: "Receive AI-powered insights and recommendations to save more.", icon: "💡" }
              ].map((item, i) => (
                <div key={`dup-${i}`} className="flex-shrink-0 w-80 mx-4 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl">
                      {item.step}
                    </div>
                    <div className="absolute top-10 left-1/2 transform translate-x-1/2 text-4xl">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Demo Section */}
      <div className="py-20 px-6 fade-in-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg animate-text-shadow">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600">Experience the power of smart expense tracking</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 hover:border-purple-300 transition-all duration-500 group">
              <h3 className="text-xl font-bold text-gray-800 mb-6 group-hover:text-purple-600 transition-colors">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 hover:border-purple-300 transition-all duration-500 group">
              <h3 className="text-xl font-bold text-gray-800 mb-6 group-hover:text-purple-600 transition-colors">Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#16A34A" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#DC2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50 fade-in-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg animate-text-shadow">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-gray-600">See what our customers have to say</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                quote: "ExpenseTracker completely transformed how I manage my finances. The AI insights helped me save ₹50,000 in just 3 months!", 
                author: "Priya Sharma", 
                role: "Software Engineer",
                avatar: "👩‍💻",
                rating: 5
              },
              { 
                quote: "The budget tracking feature is incredible. I finally have control over my spending and can see exactly where my money goes.", 
                author: "Rahul Verma", 
                role: "Business Owner",
                avatar: "👨‍💼",
                rating: 5
              },
              { 
                quote: "Best expense tracker I've ever used! The interface is beautiful and intuitive. The AI chat feature is like having a personal financial advisor.", 
                author: "Ananya Patel", 
                role: "Marketing Manager",
                avatar: "👩‍💼",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-3 hover:border-purple-300 transition-all duration-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 group">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl group-hover:scale-125 transition-transform duration-300">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic group-hover:text-gray-800 transition-colors">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className={`py-20 px-6 fade-in-section ${visibleSections.has('pricing') ? 'fade-in-visible' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg animate-text-shadow">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "₹0",
                period: "forever",
                features: ["Track unlimited transactions", "Basic analytics", "1 budget category", "Email support"],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Pro",
                price: "₹299",
                period: "per month",
                features: ["Everything in Free", "Unlimited budgets", "AI-powered insights", "Advanced analytics", "Priority support", "Export data"],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Business",
                price: "₹999",
                period: "per month",
                features: ["Everything in Pro", "Team collaboration", "Custom categories", "API access", "Dedicated support", "Custom integrations"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${plan.popular ? 'border-purple-500 relative' : 'border-gray-100'} hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full animate-bounce-slow">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    if (plan.cta === "Contact Sales") {
                      handleContactSales(plan.name, plan.price)
                    } else {
                      onGetStarted()
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl animate-text-shadow-white">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of users who are already managing their money smarter
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Start Your Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
          <p className="text-purple-100 mt-6 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-6 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about our Expense Tracker project. Click on any question to reveal detailed answers.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between group transition-all duration-200 hover:bg-purple-50"
                >
                  <span className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors pr-8">
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white transition-transform duration-300 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Answer Panel */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 py-6 bg-gradient-to-br from-purple-50 to-pink-50 border-t border-purple-100">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-4">
                      {faq.answer.split('\n\n').map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-base">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you get the most out of your expense tracking journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Get Started Free
                </button>
                <button
                  className="px-8 py-3 bg-white border-2 border-purple-500 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`bg-gray-900 text-gray-300 py-12 px-6 transition-all duration-1000 ${loadedSections.footer ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-2xl font-bold text-white">ExpenseTracker</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                The smartest way to manage your finances. Track expenses, set budgets, and achieve your financial goals with AI-powered insights.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span>𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span>in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span>f</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 ExpenseTracker. All rights reserved. Made with ❤️ in India</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Product Demo</h2>
                  <p className="text-purple-100">
                    Step {currentDemoStep + 1} of {demoSteps.length}: {demoSteps[currentDemoStep].title}
                  </p>
                </div>
                <button
                  onClick={closeDemoModal}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-white h-full transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${((currentDemoStep + 1) / demoSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Video and Summary Side by Side */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Video Section - Left Side */}
                <div className="animate-fade-in">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100" style={{ paddingBottom: '75%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={demoSteps[currentDemoStep].videoUrl}
                      title={demoSteps[currentDemoStep].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* Summary Section - Right Side */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {demoSteps[currentDemoStep].title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {demoSteps[currentDemoStep].description}
                    </p>
                  </div>

                  {/* Video Summary Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border-2 border-blue-300 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl flex-shrink-0">📝</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
                          Video Summary
                          <span className="text-xs font-normal text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                            Key Takeaway
                          </span>
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {demoSteps[currentDemoStep].summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 gap-3">
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Key Features:</h4>
                    {demoSteps[currentDemoStep].features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border-2 border-purple-200 animate-slide-up"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{feature.split(' ')[0]}</span>
                          <span className="font-semibold text-gray-700 text-sm">{feature.split(' ').slice(1).join(' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex items-center justify-center gap-2 py-4">
                {demoSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentDemoStep(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentDemoStep
                        ? 'w-12 h-3 bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-3xl flex items-center justify-between">
              <button
                onClick={prevDemoStep}
                disabled={currentDemoStep === 0}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-purple-400 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Video
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500 font-medium">
                  Video {currentDemoStep + 1} of {demoSteps.length}
                </p>
              </div>

              {currentDemoStep < demoSteps.length - 1 ? (
                <button
                  onClick={nextDemoStep}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Next Video
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={onGetStarted}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Get Started Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* AI-Powered Financial Management Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 text-white p-8 rounded-t-3xl z-10 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-2xl animate-text-shadow-white">
                    🤖 AI-Powered Financial Management
                  </h2>
                  <p className="text-purple-100 text-lg">
                    Experience the future of personal finance with cutting-edge AI technology
                  </p>
                </div>
                <button
                  onClick={closeAIModal}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 backdrop-blur-sm"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 space-y-12">
              {/* Main Definition Section */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-purple-200">
                <div className="text-center mb-8">
                  <div className="inline-block p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl mb-6 animate-bounce-slow">
                    <span className="text-6xl">🧠</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 drop-shadow-lg">
                    What is AI-Powered Financial Management?
                  </h3>
                </div>
                
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 text-center">
                  AI-Powered Financial Management is a revolutionary approach to managing your money that combines 
                  <span className="font-bold text-purple-600"> Artificial Intelligence</span>, 
                  <span className="font-bold text-pink-600"> Machine Learning</span>, and 
                  <span className="font-bold text-blue-600"> Advanced Analytics</span> to provide you with 
                  intelligent, personalized, and automated financial insights that help you make smarter decisions with your money.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="text-5xl mb-4 text-center">🔮</div>
                    <h4 className="text-xl font-bold text-purple-900 mb-3 text-center">Predictive Analysis</h4>
                    <p className="text-gray-700 text-center">AI predicts your future expenses and income patterns based on historical data</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-6 border-2 border-pink-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="text-5xl mb-4 text-center">💡</div>
                    <h4 className="text-xl font-bold text-pink-900 mb-3 text-center">Smart Recommendations</h4>
                    <p className="text-gray-700 text-center">Get personalized advice on budgeting, saving, and investment opportunities</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-6 border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="text-5xl mb-4 text-center">⚡</div>
                    <h4 className="text-xl font-bold text-blue-900 mb-3 text-center">Automated Insights</h4>
                    <p className="text-gray-700 text-center">Receive real-time alerts and actionable insights without manual tracking</p>
                  </div>
                </div>
              </div>

              {/* Animated Visualization Section */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Financial Charts Animation */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="text-3xl">📊</span>
                    Real-Time Analytics
                  </h4>
                  <div className="space-y-6">
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 animate-progress-bar rounded-full"></div>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 animate-progress-bar-delay-1 rounded-full"></div>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 animate-progress-bar-delay-2 rounded-full"></div>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-500 animate-progress-bar-delay-3 rounded-full"></div>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 font-semibold">Live tracking of your financial health</p>
                  </div>
                </div>

                {/* AI Brain Animation */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-pink-200">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="text-3xl">🧠</span>
                    AI Intelligence
                  </h4>
                  <div className="flex justify-center items-center h-48">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-full animate-pulse-slow"></div>
                      <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full animate-spin-slow opacity-50"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl animate-bounce-slow">🤖</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 font-semibold">Powered by advanced machine learning</p>
                  </div>
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: "💰", title: "Smart Budgeting", desc: "AI automatically adjusts your budget based on spending patterns", color: "from-green-400 to-emerald-500" },
                  { icon: "📈", title: "Trend Analysis", desc: "Identify spending trends and patterns over time", color: "from-blue-400 to-cyan-500" },
                  { icon: "🎯", title: "Goal Tracking", desc: "Set and achieve financial goals with AI guidance", color: "from-purple-400 to-pink-500" },
                  { icon: "🔔", title: "Smart Alerts", desc: "Get notified about unusual spending or opportunities", color: "from-orange-400 to-red-500" },
                  { icon: "💬", title: "AI Chat", desc: "Ask questions and get instant financial advice", color: "from-pink-400 to-rose-500" },
                  { icon: "📊", title: "Visual Reports", desc: "Beautiful charts and graphs for easy understanding", color: "from-indigo-400 to-purple-500" },
                  { icon: "🔐", title: "Bank Security", desc: "Industry-leading encryption for your data", color: "from-gray-600 to-gray-800" },
                  { icon: "⚡", title: "Real-Time Sync", desc: "Instant updates across all your devices", color: "from-yellow-400 to-orange-500" }
                ].map((feature, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h5 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h5>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={onGetStarted}
                  className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    <span className="text-3xl">🚀</span>
                    Start Your AI Journey Now
                    <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <p className="text-gray-500 mt-4 text-sm">No credit card required • Start free today</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Alert Modal */}
      {showPaymentAlert && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-2xl max-w-2xl w-full border-4 border-red-500 animate-slide-up transform hover:scale-105 transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse-slow">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">💳 Payment Required</h3>
                  <p className="text-red-100 text-sm">Premium Plan Activation</p>
                </div>
              </div>
              <button
                onClick={closePaymentAlert}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              {/* Warning Message */}
              <div className="bg-white rounded-xl p-6 border-2 border-red-400 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-black mb-2">Payment Required for Premium Access</h4>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      You need to complete the payment process to activate the <span className="font-bold text-red-600">{selectedPlan.name} Plan ({selectedPlan.price}/{selectedPlan.name === 'Business' ? 'per month' : 'forever'})</span>. 
                      This plan includes premium features that require a subscription.
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
                <h5 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Selected Plan Details
                </h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Plan Name</p>
                    <p className="text-xl font-bold text-purple-600">{selectedPlan.name}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="text-xl font-bold text-pink-600">{selectedPlan.price}/{selectedPlan.name === 'Business' ? 'month' : 'forever'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
                <h5 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💳</span>
                  Available Payment Methods
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Credit Card', icon: '💳' },
                    { name: 'Debit Card', icon: '🏦' },
                    { name: 'UPI', icon: '📱' },
                    { name: 'Net Banking', icon: '🌐' }
                  ].map((method, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border-2 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <div className="text-3xl mb-2">{method.icon}</div>
                      <p className="text-sm font-semibold text-gray-700">{method.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleProceedToPayment}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Proceed to Payment
                </button>
                <button
                  onClick={closePaymentAlert}
                  className="flex-1 px-8 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>

              {/* Security Note */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-300">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">🔒 Secure Payment:</span> Your payment information is encrypted and secure. We use industry-standard security measures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Information Form Modal */}
      {showPaymentForm && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-slide-up">
            {/* Header - Fixed at top */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-6 rounded-t-3xl shadow-xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse-slow backdrop-blur-sm">
                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold drop-shadow-lg">Payment Information</h2>
                    <p className="text-purple-100">Complete your {selectedPlan.name} plan purchase</p>
                  </div>
                </div>
                <button
                  onClick={closePaymentForm}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 backdrop-blur-sm"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-2/3 animate-pulse"></div>
                </div>
                <span className="text-sm font-semibold">Step 2 of 3</span>
              </div>
            </div>

            {/* Body */}
            <form onSubmit={handlePaymentSubmit} className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-8">
              {/* Plan Summary */}
              {/* Plan Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Selected Plan: {selectedPlan.name}</h3>
                    <p className="text-gray-600">Get started with premium features today!</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-4xl font-bold text-purple-600">{selectedPlan.price}</p>
                    <p className="text-sm text-gray-500">{selectedPlan.name === 'Business' ? 'per month' : 'one-time'}</p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={paymentData.fullName}
                      onChange={handlePaymentInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 text-gray-900 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={paymentData.email}
                      onChange={handlePaymentInputChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 text-gray-900 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={paymentData.phone}
                      onChange={handlePaymentInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 text-gray-900 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={paymentData.address}
                      onChange={handlePaymentInputChange}
                      placeholder="123 Main Street"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 text-gray-900 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={paymentData.city}
                      onChange={handlePaymentInputChange}
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 text-gray-900 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={paymentData.state}
                      onChange={handlePaymentInputChange}
                      placeholder="Maharashtra"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 text-gray-900 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={paymentData.zipCode}
                      onChange={handlePaymentInputChange}
                      placeholder="400001"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 text-gray-900 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Payment Method</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                    { value: 'upi', label: 'UPI', icon: '📱' },
                    { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
                    { value: 'wallet', label: 'Wallet', icon: '👛' }
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: method.value }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        paymentData.paymentMethod === method.value
                          ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                          : 'border-gray-300 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{method.icon}</div>
                      <p className="text-sm font-semibold text-gray-700">{method.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Details (shown only when card is selected) */}
              {paymentData.paymentMethod === 'card' && (
                <div className="space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-300">
                  <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">💳</span>
                    Card Details
                  </h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentInputChange}
                        required={paymentData.paymentMethod === 'card'}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Cardholder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handlePaymentInputChange}
                        required={paymentData.paymentMethod === 'card'}
                        placeholder="JOHN DOE"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handlePaymentInputChange}
                        required={paymentData.paymentMethod === 'card'}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentInputChange}
                        required={paymentData.paymentMethod === 'card'}
                        placeholder="123"
                        maxLength="4"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Details (shown only when UPI is selected) */}
              {paymentData.paymentMethod === 'upi' && (
                <div className="space-y-6 bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-300">
                  <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    UPI Payment
                  </h4>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      UPI ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-800">🔒 Secure & Encrypted Payment</p>
                    <p className="text-sm text-gray-600">Your payment information is protected with bank-level security</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Complete Payment ({selectedPlan.price})
                </button>
                <button
                  type="button"
                  onClick={closePaymentForm}
                  className="px-8 py-5 bg-gray-200 text-gray-800 rounded-xl font-bold text-xl hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>

              {/* Terms */}
              <p className="text-center text-sm text-gray-500">
                By completing this payment, you agree to our <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
              </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature Information Modal */}
      {showFeatureModal && selectedFeature && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            {/* Modal Header */}
            <div className={`bg-gradient-to-br ${selectedFeature.color} p-8 text-white relative`}>
              <button
                onClick={closeFeatureModal}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedFeature.icon}</div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">{selectedFeature.title}</h2>
                  <p className="text-white/90 text-lg">{selectedFeature.desc}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Detailed Information */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-3xl">📖</span>
                  Detailed Information
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {selectedFeature.detailedInfo}
                </p>
              </div>

              {/* Questions Form */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-3xl">❓</span>
                  Help Us Understand Your Needs
                </h3>
                <p className="text-gray-600 mb-6">Please answer these questions to help us serve you better</p>
                
                <form onSubmit={handleFeatureAnswerSubmit} className="space-y-6">
                  {/* Question 1 */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      <span className="text-purple-600">1.</span> {selectedFeature.questions[0].text}
                    </label>
                    <textarea
                      value={featureAnswers.answer1}
                      onChange={(e) => setFeatureAnswers({...featureAnswers, answer1: e.target.value})}
                      required
                      rows="3"
                      placeholder="Type your answer here..."
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Question 2 */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      <span className="text-purple-600">2.</span> {selectedFeature.questions[1].text}
                    </label>
                    <textarea
                      value={featureAnswers.answer2}
                      onChange={(e) => setFeatureAnswers({...featureAnswers, answer2: e.target.value})}
                      required
                      rows="3"
                      placeholder="Type your answer here..."
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      Submit Answers
                    </button>
                    <button
                      type="button"
                      onClick={closeFeatureModal}
                      className="px-6 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all duration-200"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
