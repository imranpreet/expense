import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard({ userId, userName, onLogout }){
  console.log('Dashboard loaded with userId:', userId, 'userName:', userName)
  
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const currencySymbol = localStorage.getItem('currencySymbol') || '$'
  const currencyCode = localStorage.getItem('preferredCurrency') || 'USD'
  const [budgetExceeded, setBudgetExceeded] = useState(false)
  const [alertSound, setAlertSound] = useState(null)
  const [isAlertPlaying, setIsAlertPlaying] = useState(false)
  const [alertInterval, setAlertInterval] = useState(null)
  
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [submitting, setSubmitting] = useState(false)

  // Listen for theme changes
  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem('theme') || 'light')
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for theme changes
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('theme') || 'light'
      if (currentTheme !== theme) {
        setTheme(currentTheme)
      }
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [theme])

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  }

  const categoryColors = {
    Food: '#DC2626',        // Dark red
    Transport: '#2563EB',   // Dark blue
    Shopping: '#7C3AED',    // Dark purple
    Entertainment: '#EA580C', // Dark orange
    Bills: '#059669',       // Dark green
    Healthcare: '#DB2777',  // Dark pink
    Education: '#0891B2',   // Dark cyan
    Other: '#64748B',       // Dark gray
    Salary: '#16A34A',      // Dark green
    Freelance: '#9333EA',   // Dark purple
    Investment: '#1D4ED8',  // Dark blue
    Gift: '#E11D48'         // Dark rose
  }

  function loadTransactions(){
    if(!userId) return
    setLoading(true)
    axios.get(`${import.meta.env.VITE_API_BASE || ''}/api/transactions/user/${userId}`)
      .then(r=>setTxs(r.data))
      .catch(()=>{})
      .finally(()=>setLoading(false))
  }

  useEffect(()=>{
    loadTransactions()
  },[userId])

  // Cleanup alert interval on component unmount
  useEffect(() => {
    return () => {
      if (alertInterval) {
        clearInterval(alertInterval)
      }
    }
  }, [alertInterval])

  // Initialize alert sound
  useEffect(() => {
    // Use multiple sound generation methods for maximum compatibility
    const playBeep = () => {
      try {
        // Method 1: Web Audio API (most reliable)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // High-pitched attention-grabbing frequency
        oscillator.frequency.value = 1200
        oscillator.type = 'square' // Square wave is louder and more noticeable
        
        // Louder volume
        gainNode.gain.setValueAtTime(0.8, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.4)
        
        console.log('Beep played successfully')
      } catch (e) {
        console.error('Audio error:', e)
        
        // Method 2: Fallback - try to play system beep
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLTgjMGHm7A7+OZLA==')
          audio.volume = 1.0
          audio.play().catch(err => console.log('Audio play failed:', err))
        } catch (err) {
          console.log('Fallback audio failed:', err)
        }
      }
    }
    
    setAlertSound({ play: playBeep })
  }, [])

  // Check if expenses exceed income (balance becomes negative)
  useEffect(() => {
    if (txs.length > 0) {
      const totalIncome = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
      const totalExpense = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
      const balance = totalIncome - totalExpense
      
      // Trigger alert when balance goes NEGATIVE (income minus mein)
      if (balance < 0 && !budgetExceeded) {
        setBudgetExceeded(true)
        setIsAlertPlaying(true) // Start alert playing state
        
        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('⚠️ Budget Alert!', {
            body: `Your balance is negative! ${currencySymbol}${Math.abs(balance).toLocaleString()} in deficit. Expenses: ${currencySymbol}${totalExpense.toLocaleString()}, Income: ${currencySymbol}${totalIncome.toLocaleString()}`,
            icon: '⚠️',
            requireInteraction: true
          })
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission()
        }
        
        // Play alert sound CONTINUOUSLY until user stops it
        if (alertSound && alertSound.play) {
          console.log('🔊 Starting CONTINUOUS budget alert sound... Balance is NEGATIVE!')
          console.log('🔔 Click the STOP ALERT button to turn off the sound')
          
          // Play first beep immediately
          alertSound.play()
          
          // Continue playing every second indefinitely
          const continuousBeepInterval = setInterval(() => {
            console.log('🔊 Alert beep continues...')
            alertSound.play()
          }, 1000) // Beep every 1 second
          
          // Store interval ID so user can stop it later
          setAlertInterval(continuousBeepInterval)
        }
      } else if (balance >= 0 && budgetExceeded) {
        // Reset when balance becomes positive again
        setBudgetExceeded(false)
        setIsAlertPlaying(false)
        
        // Stop the continuous beeping
        if (alertInterval) {
          clearInterval(alertInterval)
          setAlertInterval(null)
        }
        console.log('✅ Balance is positive now. Alert cleared.')
      }
    }
  }, [txs, alertSound, budgetExceeded, currencySymbol, alertInterval])

  // Function to stop the alert manually
  const stopAlert = () => {
    console.log('🛑 User stopped the alert manually')
    setIsAlertPlaying(false)
    
    // Stop the continuous beeping
    if (alertInterval) {
      clearInterval(alertInterval)
      setAlertInterval(null)
    }
  }

  async function handleSubmit(e){
    e.preventDefault()
    if(!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    if(!userId) {
      alert('User ID not found. Please login again.')
      return
    }
    
    setSubmitting(true)
    try{
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || ''}/api/transactions`, {
        userId,
        ...formData,
        amount: parseFloat(formData.amount)
      })
      
      setTxs([res.data, ...txs])
      setFormData({
        type: 'expense',
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowAddForm(false)
    }catch(err){
      const errorMsg = err.response?.data?.error || err.message || 'Failed to add transaction'
      alert(`Error: ${errorMsg}`)
    }finally{
      setSubmitting(false)
    }
  }

  async function handleDelete(id){
    if(!confirm('Delete this transaction?')) return
    try{
      await axios.delete(`${import.meta.env.VITE_API_BASE || ''}/api/transactions/${id}`)
      setTxs(txs.filter(t => t._id !== id))
    }catch(err){
      alert('Failed to delete transaction')
    }
  }

  const totalExpense = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)
  const totalIncome = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0)
  const balance = totalIncome - totalExpense

  // Category breakdown for pie chart
  const categoryBreakdown = {}
  txs.filter(t=>t.type==='expense').forEach(t=>{
    categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount
  })
  
  const pieData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value: Math.round(value),
    color: categoryColors[name] || '#475569'  // Dark slate gray as fallback
  }))

  // Monthly trend data for bar chart
  const last6Months = []
  const today = new Date()
  for(let i = 5; i >= 0; i--){
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthName = d.toLocaleDateString('en-US', { month: 'short' })
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    
    const monthExpenses = txs.filter(t => {
      const tDate = new Date(t.date)
      const tKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`
      return t.type === 'expense' && tKey === monthKey
    }).reduce((s,t)=>s+t.amount, 0)
    
    const monthIncome = txs.filter(t => {
      const tDate = new Date(t.date)
      const tKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`
      return t.type === 'income' && tKey === monthKey
    }).reduce((s,t)=>s+t.amount, 0)
    
    last6Months.push({
      month: monthName,
      Expenses: Math.round(monthExpenses),
      Income: Math.round(monthIncome)
    })
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
    }`}>
      {/* Welcome Section */}
      <div className={`backdrop-blur-sm border-b px-6 py-8 mb-8 ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700'
          : 'bg-white/50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Welcome back, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{userName}</span>!
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Here's your financial overview
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Card */}
          <div className={`rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                TOTAL INCOME
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {currencySymbol}{totalIncome.toLocaleString()}
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              {txs.filter(t=>t.type==='income').length} transactions
            </div>
          </div>

          {/* Expense Card */}
          <div className={`rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                TOTAL EXPENSES
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {currencySymbol}{totalExpense.toLocaleString()}
            </div>
            <div className="flex items-center text-red-600 text-sm font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              {txs.filter(t=>t.type==='expense').length} transactions
            </div>
          </div>

          {/* Balance Card */}
          <div className={`rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 ${
            budgetExceeded
              ? 'bg-gradient-to-br from-red-600 to-red-700 text-white border-red-500 animate-pulse-slow ring-4 ring-red-300' 
              : balance >= 0 
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-300' 
              : 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-orange-300'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white/90">NET BALANCE</span>
            </div>
            <div className="text-4xl font-bold mb-2">{currencySymbol}{balance.toLocaleString()}</div>
            
            {budgetExceeded && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3 animate-bounce-slow">
                <div className="flex items-center text-sm font-bold text-white">
                  <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  ⚠️ ALERT: Expenses exceed income!
                </div>
                <p className="text-xs text-white/90 mt-1 ml-7">You've spent more than you earned. Review your budget!</p>
              </div>
            )}
            
            <div className="flex items-center text-sm font-medium text-white/80">
              {budgetExceeded ? (
                <>
                  <svg className="w-4 h-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Over Budget - Take Action!
                </>
              ) : balance >= 0 ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Healthy balance
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Budget deficit
                </>
              )}
            </div>
          </div>
        </div>

        {/* Alert Control Button - Shows when budget exceeded */}
        {budgetExceeded && (
          <div className="flex justify-center mb-6">
            <button
              onClick={stopAlert}
              className={`px-8 py-5 text-white rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 flex items-center space-x-3 ${
                isAlertPlaying 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 animate-pulse-slow ring-4 ring-red-300 scale-110' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 opacity-50'
              }`}
              disabled={!isAlertPlaying}
            >
              <svg className={`w-8 h-8 ${isAlertPlaying ? 'animate-bounce' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              {isAlertPlaying ? (
                <>
                  <span>� STOP ALERT</span>
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </>
              ) : (
                <span>✓ Alert Stopped</span>
              )}
            </button>
          </div>
        )}

        {/* Add Transaction Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-3"
          >
            {showAddForm ? (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Transaction</span>
              </>
            )}
          </button>
        </div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Transaction</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Type Toggle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Type</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'income', category: 'Salary'})}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        formData.type === 'income'
                          ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'expense', category: 'Food'})}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        formData.type === 'expense'
                          ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Expense
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  >
                    {categories[formData.type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-semibold placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Add notes about this transaction..."
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {submitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding...</span>
                  </span>
                ) : (
                  'Add Transaction'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <span>Expense by Category</span>
            </h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p className="font-medium">No expense data yet</p>
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Income vs Expenses</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="Income" fill="#16A34A" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Expenses" fill="#DC2626" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Recent Transactions</span>
            </h3>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              {txs.length} Total
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : txs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-4">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">No transactions yet</h4>
              <p className="text-gray-600">Start adding your income and expenses to see them here!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {txs.map(t => (
                <div
                  key={t._id}
                  className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        t.type === 'expense' 
                          ? 'bg-gradient-to-br from-red-400 to-pink-500' 
                          : 'bg-gradient-to-br from-green-400 to-green-500'
                      }`}>
                        {t.type === 'expense' ? (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            t.type === 'expense'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {t.category}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(t.date).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        {t.description && (
                          <p className="text-sm text-gray-600 truncate">{t.description}</p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          t.type === 'expense' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {t.type === 'expense' ? '-' : '+'}{currencySymbol}{t.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
