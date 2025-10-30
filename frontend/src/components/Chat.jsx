import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const suggestedQuestions = [
  "How much did I spend on food?",
  "What's my biggest expense category?",
  "Give me a spending summary",
  "Any savings tips for me?"
]

const aiFeatures = [
  { icon: "📊", title: "Smart Analysis", desc: "Deep insights from your data" },
  { icon: "🔮", title: "Predictive Insights", desc: "Forecast future spending" },
  { icon: "🎯", title: "Goal Tracking", desc: "Monitor financial goals" },
  { icon: "📈", title: "Data Visualization", desc: "Beautiful charts & graphs" },
  { icon: "🔒", title: "Secure & Private", desc: "Your data stays safe" },
  { icon: "⚡", title: "Real-time Updates", desc: "Instant financial analysis" }
]

export default function Chat(){
  const [messages, setMessages] = useState([
    { from: 'assistant', text: "👋 Hi! I'm your AI finance assistant. I can help you analyze your spending, track budgets, and give personalized saving tips. Ask me anything!" }
  ])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [introStep, setIntroStep] = useState(0)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const messagesEndRef = useRef(null)
  const userId = localStorage.getItem('userId') || ''

  // Listen for theme changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('theme') || 'light'
      if (currentTheme !== theme) {
        setTheme(currentTheme)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [theme])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Intro animation sequence
  useEffect(() => {
    if (!showIntro) return
    
    const timers = [
      setTimeout(() => setIntroStep(1), 800),
      setTimeout(() => setIntroStep(2), 2000),
      setTimeout(() => setIntroStep(3), 3500),
      setTimeout(() => setIntroStep(4), 5000),
      setTimeout(() => setShowIntro(false), 6500)
    ]
    
    return () => timers.forEach(clearTimeout)
  }, [showIntro])

  async function send(question = text){
    const messageText = question || text.trim()
    if(!messageText) return
    
    setMessages(m=>[...m, { from: 'user', text: messageText }])
    setText('')
    setLoading(true)
    
    try{
      const resp = await axios.post(`${import.meta.env.VITE_API_BASE || ''}/api/chat/query`, { userId, message: messageText })
      setMessages(m=>[...m, { from: 'assistant', text: resp.data.reply }])
    }catch(err){
      setMessages(m=>[...m, { from: 'assistant', text: '❌ Sorry, I encountered an error. Please try again.' }])
    }finally{
      setLoading(false)
    }
  }

  function handleKeyPress(e){
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault()
      send()
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'}`}>
      <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Intro Animation Screen */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float-gentle"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-bounce-slow"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Intro Content */}
          <div className="relative z-10 text-center space-y-8 px-4">
            {/* Robot AI Character */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="text-8xl animate-bounce-slow">🤖</div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-2xl opacity-50 animate-pulse-ring"></div>
              </div>
            </div>

            {/* Training Progress */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white animate-fade-in">
                {introStep === 0 && "Initializing FinanceBot AI..."}
                {introStep === 1 && "Analyzing Your Financial Data..."}
                {introStep === 2 && "Training Personalized Insights..."}
                {introStep === 3 && "Preparing Smart Recommendations..."}
                {introStep === 4 && "Ready to Help You! 🎉"}
              </h2>
              
              <div className="w-64 mx-auto bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-700"
                  style={{ width: `${(introStep + 1) * 20}%` }}
                ></div>
              </div>
            </div>

            {/* AI Features Grid */}
            {introStep >= 2 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto animate-slide-up">
                {aiFeatures.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h4 className="text-white font-bold text-sm">{feature.title}</h4>
                    <p className="text-white/70 text-xs">{feature.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl mb-4 shadow-lg animate-bounce-slow">
          <span className="text-4xl">🤖</span>
        </div>
        <h1 className={`text-4xl md:text-5xl font-black mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'}`}>FinanceBot AI</h1>
        <p className={`font-medium text-lg flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-purple-600/80'}`}>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Online • Ready to assist you
        </p>
      </div>

      {/* Chat Container */}
      <div className={`rounded-3xl shadow-2xl border-2 min-h-[600px] flex flex-col ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-purple-200'}`}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{maxHeight: '500px'}}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`flex items-start space-x-3 max-w-[80%] ${m.from === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                  m.from === 'user' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-300 shadow-lg' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-500 border-blue-300 shadow-lg'
                }`}>
                  {m.from === 'user' ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <span className="text-lg">🤖</span>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`px-4 py-3 rounded-2xl shadow-md ${
                  m.from === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-tr-sm border-2 border-purple-300 font-medium'
                    : theme === 'dark'
                    ? 'bg-slate-700 text-white border-2 border-slate-600 rounded-tl-sm font-medium'
                    : 'bg-purple-50 text-purple-900 border-2 border-purple-200 rounded-tl-sm font-medium'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-slide-up">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-blue-300 shadow-lg flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div className={`px-4 py-3 rounded-2xl rounded-tl-sm shadow-md ${theme === 'dark' ? 'bg-slate-700 border-2 border-slate-600' : 'bg-purple-50 border-2 border-purple-200'}`}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className={`px-6 py-4 border-t-2 ${theme === 'dark' ? 'border-slate-700 bg-slate-700/50' : 'border-purple-100 bg-purple-50/50'}`}>
            <p className={`text-sm font-bold mb-3 uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'}`}>💡 Try asking:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => send(q)}
                  className={`text-left px-4 py-2 rounded-lg text-sm border-2 transition-all duration-200 hover:shadow-md font-medium ${
                    theme === 'dark'
                      ? 'bg-slate-600 hover:bg-slate-500 text-white border-slate-500 hover:border-slate-400'
                      : 'bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-purple-700 border-purple-200 hover:border-purple-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`p-6 border-t-2 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-purple-100 bg-gradient-to-r from-purple-50/30 via-pink-50/30 to-blue-50/30'}`}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={text}
                onChange={e=>setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here..."
                rows="1"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-200 outline-none resize-none font-medium ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-200'
                    : 'bg-white border-purple-200 text-purple-900 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-200'
                }`}
                style={{minHeight: '48px', maxHeight: '120px'}}
              />
            </div>
            <button
              onClick={() => send()}
              disabled={loading || !text.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-xl font-bold hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 uppercase tracking-wider"
            >
              <span>Send</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className={`text-xs mt-2 font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-purple-600/70'}`}>
            Press <kbd className={`px-2 py-1 border rounded text-xs ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-purple-100 border-purple-300 text-purple-600'}`}>Enter</kbd> to send
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiFeatures.slice(0, 3).map((feature, idx) => (
          <div key={idx} className={`rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-purple-200'}`}>
            <div className="flex items-start space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                {feature.icon}
              </div>
              <div>
                <h4 className={`font-bold text-sm uppercase ${theme === 'dark' ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'}`}>{feature.title}</h4>
                <p className={`text-xs mt-1 font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-purple-600/80'}`}>{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}
