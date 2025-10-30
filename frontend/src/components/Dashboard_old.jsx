import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard({ userId, userName, onLogout }){
  console.log('Dashboard loaded with userId:', userId, 'userName:', userName)
  
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [submitting, setSubmitting] = useState(false)

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  }

  const categoryColors = {
    Food: '#f97316',
    Transport: '#3b82f6',
    Shopping: '#ec4899',
    Entertainment: '#8b5cf6',
    Bills: '#f59e0b',
    Healthcare: '#10b981',
    Education: '#06b6d4',
    Other: '#6b7280',
    Salary: '#22c55e',
    Freelance: '#a855f7',
    Investment: '#14b8a6',
    Gift: '#f43f5e'
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
      console.log('Submitting transaction:', {
        userId,
        ...formData,
        amount: parseFloat(formData.amount)
      })
      
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || ''}/api/transactions`, {
        userId,
        ...formData,
        amount: parseFloat(formData.amount)
      })
      
      console.log('Transaction created:', res.data)
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
      console.error('Transaction error:', err)
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
    color: categoryColors[name] || '#6b7280'
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
    <div className="min-h-screen bg-darkgreen">
      {/* Welcome Section with Glowing Golden Text */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r text-cream-100 animate-pulse  tracking-wider mb-3">
          Welcome back, {userName}!
        </h1>
        <p className="text-cream-200 text-lg font-semibold tracking-wide">Your Premium Financial Overview</p>
        <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full animate-shimmer"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Card */}
          <div className="group relative bg-gradient-to-br from-amber-900 via-darkgreen to-darkgreen border-2 border-teal-500/30 rounded-3xl p-6 shadow-2xl  transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg ">
                  <svg className="w-8 h-8 text-cream-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <span className="text-yellow-500 text-sm font-bold tracking-wider">TOTAL INCOME</span>
              </div>
              <div className="text-5xl font-black text-cream-100 animate-pulse mb-2 ">₹{totalIncome.toLocaleString()}</div>
              <div className="flex items-center text-cream-200 text-sm font-semibold">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                {txs.filter(t=>t.type==='income').length} transactions
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="group relative bg-gradient-to-br from-red-900 via-darkgreen to-darkgreen border-2 border-red-500/30 rounded-3xl p-6 shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-lg">
                  <svg className="w-8 h-8 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <span className="text-red-400 text-sm font-bold tracking-wider">TOTAL EXPENSES</span>
              </div>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-2">₹{totalExpense.toLocaleString()}</div>
              <div className="flex items-center text-red-500 text-sm font-semibold">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                {txs.filter(t=>t.type==='expense').length} transactions
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className={`group relative rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border-2 ${
            balance >= 0 
              ? 'bg-gradient-to-br from-emerald-900 via-darkgreen to-darkgreen border-emerald-500/30 hover:shadow-emerald-500/50' 
              : 'bg-gradient-to-br from-orange-900 via-darkgreen to-darkgreen border-orange-500/30 hover:shadow-orange-500/50'
          }`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl ${
              balance >= 0 ? 'bg-emerald-500/5' : 'bg-orange-500/5'
            }`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl shadow-lg ${
                  balance >= 0 
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                    : 'bg-gradient-to-br from-orange-500 to-orange-700'
                }`}>
                  <svg className="w-8 h-8 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`text-sm font-bold tracking-wider ${
                  balance >= 0 ? 'text-emerald-400' : 'text-orange-400'
                }`}>NET BALANCE</span>
              </div>
              <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r mb-2 ${
                balance >= 0 
                  ? 'from-emerald-400 to-emerald-600' 
                  : 'from-orange-400 to-orange-600'
              }`}>₹{balance.toLocaleString()}</div>
              <div className={`flex items-center text-sm font-semibold ${
                balance >= 0 ? 'text-emerald-500' : 'text-orange-500'
              }`}>
                {balance >= 0 ? (
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
        </div>

        {/* Add Transaction Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="group relative px-10 py-5 bg-gradient-to-r text-cream-100 animate-pulse text-cream-100 rounded-2xl font-black text-xl shadow-2xl  hover:shadow-teal-500/70 transform hover:scale-110 transition-all duration-300 overflow-hidden tracking-wider"
          >
            <span className="relative z-10 flex items-center space-x-3">
              {showAddForm ? (
                <>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>CANCEL</span>
                </>
              ) : (
                <>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>ADD TRANSACTION</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
          </button>
        </div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <div className="bg-gradient-to-br from-teal-900/20 via-darkgreen to-darkgreen border-2 border-teal-500/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl  animate-fade-in">
            <h3 className="text-3xl font-black text-cream-100 animate-pulse mb-8 flex items-center space-x-3  tracking-wider">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>NEW TRANSACTION</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Type Toggle */}
                <div>
                  <label className="block text-yellow-500 font-bold mb-3 tracking-wide">TYPE</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'income', category: 'Salary'})}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                        formData.type === 'income'
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-darkgreen shadow-lg shadow-emerald-500/50 scale-105 border-2 border-emerald-400'
                          : 'bg-darkgreen/50 text-cream-200 hover:bg-teal-500/10 border-2 border-teal-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span>Income</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'expense', category: 'Food'})}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                        formData.type === 'expense'
                          ? 'bg-gradient-to-r from-red-500 to-pink-600 text-darkgreen shadow-lg shadow-red-500/50 scale-105 border-2 border-red-400'
                          : 'bg-darkgreen/50 text-cream-200 hover:bg-teal-500/10 border-2 border-teal-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <span>Expense</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-yellow-500 font-bold mb-3 tracking-wide">CATEGORY</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-darkgreen/50 border-2 border-teal-500/30 rounded-xl text-teal-400 font-bold focus:border-emerald-400 focus:ring-2 focus:ring-yellow-300/30 transition-all outline-none"
                  >
                    {categories[formData.type].map(cat => (
                      <option key={cat} value={cat} className="bg-darkgreen">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-yellow-500 font-bold mb-3 tracking-wide">AMOUNT (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-darkgreen/50 border-2 border-teal-500/30 rounded-xl text-teal-400 text-lg font-black placeholder-yellow-600/40 focus:border-emerald-400 focus:ring-2 focus:ring-yellow-300/30 transition-all outline-none"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-yellow-500 font-bold mb-3 tracking-wide">DATE</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-darkgreen/50 border-2 border-teal-500/30 rounded-xl text-teal-400 font-bold focus:border-emerald-400 focus:ring-2 focus:ring-yellow-300/30 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-yellow-500 font-bold mb-3 tracking-wide">DESCRIPTION (OPTIONAL)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Add notes about this transaction..."
                  rows="3"
                  className="w-full px-4 py-3 bg-darkgreen/50 border-2 border-teal-500/30 rounded-xl text-teal-400 placeholder-yellow-600/40 focus:border-emerald-400 focus:ring-2 focus:ring-yellow-300/30 transition-all outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-gradient-to-r text-cream-100 animate-pulse text-cream-100 rounded-xl font-black text-xl tracking-wider hover:shadow-2xl  hover:shadow-teal-500/70 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>ADDING...</span>
                  </span>
                ) : (
                  'ADD TRANSACTION'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-gradient-to-br from-teal-900/20 via-darkgreen to-darkgreen border-2 border-teal-500/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl ">
            <h3 className="text-2xl font-black text-cream-100 animate-pulse mb-6 flex items-center space-x-2  tracking-wide">
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <span>EXPENSE BY CATEGORY</span>
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.95)', 
                      border: '2px solid rgba(251, 191, 36, 0.5)',
                      borderRadius: '12px',
                      color: '#fbbf24',
                      fontWeight: 'bold'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-cream-200/60">
                <p className="font-bold">No expense data yet</p>
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-gradient-to-br from-teal-900/20 via-darkgreen to-darkgreen border-2 border-teal-500/30 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl ">
            <h3 className="text-2xl font-black text-cream-100 animate-pulse mb-6 flex items-center space-x-2  tracking-wide">
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>INCOME VS EXPENSES</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(251, 191, 36, 0.1)" />
                <XAxis dataKey="month" stroke="#fbbf24" style={{ fontWeight: 'bold' }} />
                <YAxis stroke="#fbbf24" style={{ fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.95)', 
                    border: '2px solid rgba(251, 191, 36, 0.5)',
                    borderRadius: '12px',
                    color: '#fbbf24',
                    fontWeight: 'bold'
                  }}
                />
                <Legend />
                <Bar dataKey="Income" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-gradient-to-br from-teal-900/20 via-darkgreen to-darkgreen backdrop-blur-2xl rounded-3xl p-8 border-2 border-teal-500/30 shadow-2xl ">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-cream-100 animate-pulse flex items-center space-x-2  tracking-wide">
              <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>RECENT TRANSACTIONS</span>
            </h3>
            <span className="px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-teal-500/30 backdrop-blur-sm text-teal-400 rounded-full text-sm font-bold">
              {txs.length} TOTAL
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-10 w-10 text-teal-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : txs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/10 border-2 border-teal-500/30 mb-4">
                <svg className="w-10 h-10 text-teal-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-cream-100 animate-pulse mb-2">No transactions yet</h4>
              <p className="text-teal-400/60 font-medium">Start adding your income and expenses to see them here!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {txs.map(t => (
                <div
                  key={t._id}
                  className="group relative bg-lightgreen hover:bg-lightgreen backdrop-blur-sm rounded-2xl p-4 border-2 border-teal-500/20 hover:border-teal-500/50 transition-all duration-300 "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        t.type === 'expense' 
                          ? 'bg-gradient-to-br from-red-500 to-red-700 border border-red-400/30' 
                          : 'bg-gradient-to-br from-emerald-500 to-emerald-700 border border-emerald-400/30'
                      }`}>
                        {t.type === 'expense' ? (
                          <svg className="w-6 h-6 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            t.type === 'expense'
                              ? 'bg-red-500/20 text-red-300 border-red-400/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                          }`}>
                            {t.category}
                          </span>
                          <span className="text-xs text-teal-400/70 font-semibold">
                            {new Date(t.date).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        {t.description && (
                          <p className="text-sm text-darkgreen/90 truncate font-medium">{t.description}</p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-2xl font-black ${
                          t.type === 'expense' ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                          {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="ml-4 p-2 text-teal-400/40 hover:text-red-400 hover:bg-red-500/20 border border-transparent hover:border-red-500/30 rounded-lg transition-all duration-300"
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
