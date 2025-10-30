import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Budget({ userId }) {
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Form state
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other']
  const periods = ['weekly', 'monthly', 'quarterly', 'yearly']

  useEffect(() => {
    if (userId) {
      fetchBudgets()
      fetchTransactions()
    }
  }, [userId])

  // Auto-refresh transactions every 5 seconds to stay in sync
  useEffect(() => {
    if (userId) {
      const interval = setInterval(() => {
        fetchTransactions()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [userId])

  async function fetchBudgets() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || ''}/api/budgets/user/${userId}`)
      setBudgets(res.data)
    } catch (err) {
      console.error('Error fetching budgets:', err)
    }
  }

  async function fetchTransactions() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || ''}/api/transactions/user/${userId}`)
      console.log('Fetched transactions for budget:', res.data)
      setTransactions(res.data.filter(t => t.type === 'expense'))
    } catch (err) {
      console.error('Error fetching transactions:', err)
    }
  }

  function calculateSpent(budget) {
    const start = new Date(budget.startDate || Date.now())
    const end = new Date(budget.endDate || Date.now())
    
    console.log('Calculating spent for budget:', budget.category)
    console.log('Budget date range:', start, 'to', end)
    console.log('All transactions:', transactions)
    
    // Match transactions by category (case-insensitive)
    const categoryTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const categoryMatch = t.category?.toLowerCase() === budget.category?.toLowerCase()
      const dateInRange = transactionDate >= start && transactionDate <= end
      
      console.log(`Transaction ${t.category} (${t.amount}):`, {
        categoryMatch,
        dateInRange,
        transactionDate,
        included: categoryMatch && dateInRange
      })
      
      return categoryMatch && dateInRange
    })
    
    const total = categoryTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    console.log(`Total spent for ${budget.category}:`, total, 'from', categoryTransactions.length, 'transactions')
    
    return total
  }

  function getProgressColor(percentage) {
    if (percentage < 50) return 'from-emerald-500 to-teal-600'
    if (percentage < 75) return 'from-teal-500 to-cyan-600'
    if (percentage < 90) return 'from-emerald-500 to-teal-600'
    return 'from-red-500 to-red-600'
  }

  function getProgressStatus(percentage) {
    if (percentage < 50) return { text: 'On Track', icon: '✓', color: 'text-emerald-400' }
    if (percentage < 75) return { text: 'Good', icon: '✓', color: 'text-teal-400' }
    if (percentage < 90) return { text: 'Warning', icon: '⚠', color: 'text-teal-400' }
    return { text: 'Over Budget', icon: '✗', color: 'text-red-400' }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const budgetData = {
        userId,
        category,
        amount: parseFloat(amount),
        period,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE || ''}/api/budgets/${editingId}`, budgetData)
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE || ''}/api/budgets`, budgetData)
      }

      await fetchBudgets()
      resetForm()
    } catch (err) {
      console.error('Error saving budget:', err)
      alert(err.response?.data?.error || 'Failed to save budget')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this budget?')) return
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE || ''}/api/budgets/${id}`)
      await fetchBudgets()
    } catch (err) {
      console.error('Error deleting budget:', err)
      alert('Failed to delete budget')
    }
  }

  function handleEdit(budget) {
    setEditingId(budget._id)
    setCategory(budget.category)
    setAmount(budget.amount.toString())
    setPeriod(budget.period)
    setStartDate(budget.startDate?.split('T')[0] || '')
    setEndDate(budget.endDate?.split('T')[0] || '')
    setShowForm(true)
  }

  function resetForm() {
    setEditingId(null)
    setCategory('')
    setAmount('')
    setPeriod('monthly')
    setStartDate('')
    setEndDate('')
    setShowForm(false)
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + calculateSpent(b), 0)
  const remainingBudget = totalBudget - totalSpent

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Budget Planner
          </h1>
          <p className="text-lg text-gray-600">
            Create and track budgets for better financial control
          </p>
          <button
            onClick={() => {
              fetchBudgets()
              fetchTransactions()
            }}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Budget */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-semibold text-sm">Total Budget</span>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              ₹{totalBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 font-medium">Across {budgets.length} categories</div>
          </div>

          {/* Total Spent */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-semibold text-sm">Total Spent</span>
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
          </div>
          <div className="text-4xl font-black text-red-400 mb-2">
            ₹{totalSpent.toLocaleString()}
          </div>
          <div className="text-sm text-red-400/60 font-medium">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget used
          </div>
        </div>

        {/* Remaining */}
        <div className={`bg-gradient-to-br ${remainingBudget >= 0 ? 'from-emerald-900/20' : 'from-orange-900/20'} via-darkgreen to-darkgreen-light border-2 ${remainingBudget >= 0 ? 'border-emerald-500/30' : 'border-orange-500/30'} rounded-3xl p-6 shadow-2xl hover:border-opacity-50 transition-all duration-300 hover:scale-105`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`${remainingBudget >= 0 ? 'text-emerald-400/80' : 'text-orange-400/80'} font-bold uppercase text-sm tracking-wider`}>
              {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
            </span>
            <div className={`w-12 h-12 bg-gradient-to-br ${remainingBudget >= 0 ? 'from-emerald-500 to-teal-600' : 'from-orange-500 to-red-600'} rounded-xl flex items-center justify-center`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={remainingBudget >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"} />
              </svg>
            </div>
          </div>
          <div className={`text-4xl font-black ${remainingBudget >= 0 ? 'text-emerald-400' : 'text-orange-400'} mb-2`}>
            ₹{Math.abs(remainingBudget).toLocaleString()}
          </div>
          <div className={`text-sm ${remainingBudget >= 0 ? 'text-emerald-400/60' : 'text-orange-400/60'} font-medium`}>
            {remainingBudget >= 0 ? 'Available to spend' : 'Exceeding budget'}
          </div>
        </div>
      </div>

      {/* Create Budget Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-cream-100 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-teal-500/50 transform hover:scale-105 transition-all duration-300  uppercase tracking-wider flex items-center space-x-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{showForm ? 'Cancel' : editingId ? 'Edit Budget' : 'Create New Budget'}</span>
        </button>
      </div>

      {/* Budget Form */}
      {showForm && (
        <div className="bg-lightgreen border-2 border-teal-500/30 rounded-3xl p-8 shadow-2xl  animate-slide-down">
          <h3 className="text-2xl font-black text-cream-100 animate-pulse mb-6 uppercase tracking-wide">
            {editingId ? 'Edit Budget' : 'Create New Budget'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-black text-cream-100 animate-pulse mb-2 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-lightgreen border-2 border-teal-500/30 text-darkgreen rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 outline-none font-medium"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-black text-cream-100 animate-pulse mb-2 uppercase tracking-wider">
                  Budget Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="10000"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-lightgreen border-2 border-teal-500/30 text-darkgreen placeholder-teal-400/40 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 outline-none font-medium"
                />
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-black text-cream-100 animate-pulse mb-2 uppercase tracking-wider">
                  Period
                </label>
                <select
                  value={period}
                  onChange={e => setPeriod(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-lightgreen border-2 border-teal-500/30 text-darkgreen rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 outline-none font-medium"
                >
                  {periods.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-black text-cream-100 animate-pulse mb-2 uppercase tracking-wider">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-lightgreen border-2 border-teal-500/30 text-darkgreen rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 outline-none font-medium"
                />
              </div>

              {/* End Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-black text-cream-100 animate-pulse mb-2 uppercase tracking-wider">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-lightgreen border-2 border-teal-500/30 text-darkgreen rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 outline-none font-medium"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-cream-100 rounded-xl font-black hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wider "
              >
                {loading ? 'SAVING...' : editingId ? 'UPDATE BUDGET' : 'CREATE BUDGET'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-lightgreen border-2 border-teal-500/30 text-teal-400 rounded-xl font-black hover:bg-teal-500/10 hover:border-teal-500/50 transition-all duration-200 uppercase tracking-wider"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget List */}
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-cream-100 animate-pulse uppercase tracking-wide">
          Your Budgets ({budgets.length})
        </h2>

        {budgets.length === 0 ? (
          <div className="bg-lightgreen border-2 border-teal-500/30 rounded-3xl p-12 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/10 border-2 border-teal-500/30 mb-4">
              <svg className="w-10 h-10 text-teal-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-cream-100 animate-pulse mb-2">
              No budgets yet
            </h4>
            <p className="text-teal-400/60 font-medium">
              Create your first budget to start tracking your expenses!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {budgets.map(budget => {
              const spent = calculateSpent(budget)
              const percentage = (spent / budget.amount) * 100
              const status = getProgressStatus(percentage)
              
              return (
                <div
                  key={budget._id}
                  className="bg-lightgreen border-2 border-teal-500/30 rounded-3xl p-6 shadow-2xl  hover:scale-105 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center ">
                        <span className="text-2xl">{budget.category === 'Food' ? '🍕' : budget.category === 'Transport' ? '🚗' : budget.category === 'Shopping' ? '🛍️' : budget.category === 'Entertainment' ? '🎬' : budget.category === 'Bills' ? '📄' : budget.category === 'Healthcare' ? '⚕️' : budget.category === 'Education' ? '📚' : '💰'}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-cream-100 animate-pulse uppercase">
                          {budget.category}
                        </h3>
                        <p className="text-sm text-teal-400/60 font-semibold uppercase">
                          {budget.period}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-2 text-teal-400 hover:bg-teal-500/20 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Amount Info */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-black text-white">
                        ₹{spent.toLocaleString()}
                      </span>
                      <span className="text-sm text-teal-400/60 font-semibold">
                        of ₹{budget.amount.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative h-3 bg-lightgreen rounded-full overflow-hidden border border-teal-500/20">
                      <div
                        className={`h-full bg-gradient-to-r ${getProgressColor(percentage)} transition-all duration-500 rounded-full`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Percentage */}
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-2 ${status.color} font-bold`}>
                      <span className="text-lg">{status.icon}</span>
                      <span className="uppercase tracking-wide">{status.text}</span>
                    </div>
                    <span className={`text-2xl font-black ${status.color}`}>
                      {Math.round(percentage)}%
                    </span>
                  </div>

                  {/* Dates */}
                  {(budget.startDate || budget.endDate) && (
                    <div className="mt-4 pt-4 border-t border-teal-500/20 text-xs text-teal-400/60 font-semibold flex items-center justify-between">
                      {budget.startDate && (
                        <span>Start: {new Date(budget.startDate).toLocaleDateString()}</span>
                      )}
                      {budget.endDate && (
                        <span>End: {new Date(budget.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
