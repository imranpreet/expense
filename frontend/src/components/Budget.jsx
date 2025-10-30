import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Budget({ userId }) {
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const currencySymbol = localStorage.getItem('currencySymbol') || '$'
  
  // Form state
  const [category, setCategory] = useState('Food')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other']
  const periods = ['weekly', 'monthly', 'quarterly', 'yearly']

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

  useEffect(() => {
    if (userId) {
      fetchBudgets()
      fetchTransactions()
    }
  }, [userId])

  // Auto-refresh transactions every 5 seconds to stay in sync with Dashboard
  useEffect(() => {
    if (userId) {
      const interval = setInterval(() => {
        fetchTransactions()
        fetchBudgets() // Also refresh budgets
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
      console.log('✅ Fetched transactions for budget:', res.data)
      const expenses = res.data.filter(t => t.type === 'expense')
      console.log('💸 Expense transactions only:', expenses)
      setTransactions(expenses)
    } catch (err) {
      console.error('Error fetching transactions:', err)
    }
  }

  function calculateSpent(budget) {
    if (!budget || !transactions || transactions.length === 0) {
      console.log('⚠️ No budget or transactions available')
      return 0
    }

    console.log('🔍 Calculating spent for budget:', budget.category)
    console.log('📊 Budget details:', {
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate
    })
    console.log('� Total transactions available:', transactions.length)
    
    // Set date range - if no dates, use current month by default
    let start, end
    
    if (budget.startDate && budget.endDate) {
      // Use specified dates
      start = new Date(budget.startDate)
      end = new Date(budget.endDate)
      end.setHours(23, 59, 59, 999) // Include entire end date
    } else {
      // Default to current period based on budget period
      const now = new Date()
      
      switch(budget.period) {
        case 'weekly':
          // Current week (Monday to Sunday)
          const day = now.getDay()
          const diff = now.getDate() - day + (day === 0 ? -6 : 1)
          start = new Date(now.setDate(diff))
          start.setHours(0, 0, 0, 0)
          end = new Date(start)
          end.setDate(start.getDate() + 6)
          end.setHours(23, 59, 59, 999)
          break
          
        case 'monthly':
          // Current month
          start = new Date(now.getFullYear(), now.getMonth(), 1)
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
          break
          
        case 'quarterly':
          // Current quarter
          const quarter = Math.floor(now.getMonth() / 3)
          start = new Date(now.getFullYear(), quarter * 3, 1)
          end = new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999)
          break
          
        case 'yearly':
          // Current year
          start = new Date(now.getFullYear(), 0, 1)
          end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
          break
          
        default:
          // Default to current month
          start = new Date(now.getFullYear(), now.getMonth(), 1)
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      }
    }
    
    console.log('📅 Date range:', {
      start: start.toLocaleDateString(),
      end: end.toLocaleDateString(),
      startISO: start.toISOString(),
      endISO: end.toISOString()
    })
    
    // Filter transactions by category and date
    const matchingTransactions = transactions.filter(t => {
      if (!t || !t.category || !t.date) {
        console.log('⚠️ Invalid transaction:', t)
        return false
      }
      
      // Match category (case-insensitive, trim whitespace)
      const transactionCategory = t.category.toLowerCase().trim()
      const budgetCategory = budget.category.toLowerCase().trim()
      const categoryMatch = transactionCategory === budgetCategory
      
      // Check date range
      const transactionDate = new Date(t.date)
      const dateInRange = transactionDate >= start && transactionDate <= end
      
      console.log(`  💳 Transaction: ${t.category} ${currencySymbol}${t.amount} on ${transactionDate.toLocaleDateString()}`, {
        categoryMatch: categoryMatch ? '✅' : '❌',
        dateInRange: dateInRange ? '✅' : '❌',
        included: categoryMatch && dateInRange ? '✅ INCLUDED' : '❌ excluded'
      })
      
      return categoryMatch && dateInRange
    })
    
    const totalSpent = matchingTransactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount) || 0
      return sum + amount
    }, 0)
    
    console.log('💰 Result:', {
      matchedTransactions: matchingTransactions.length,
      totalSpent: totalSpent,
      budget: budget.amount,
      percentage: ((totalSpent / budget.amount) * 100).toFixed(1) + '%'
    })
    console.log('✅ Calculation complete for', budget.category)
    console.log('─'.repeat(50))
    
    return totalSpent
  }

  function getProgressColor(percentage) {
    if (percentage < 50) return 'bg-green-400'
    if (percentage < 75) return 'bg-blue-400'
    if (percentage < 90) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  function getProgressStatus(percentage) {
    if (percentage < 50) return { text: 'On Track', icon: '✓', color: 'text-green-600' }
    if (percentage < 75) return { text: 'Good', icon: '✓', color: 'text-blue-600' }
    if (percentage < 90) return { text: 'Warning', icon: '⚠', color: 'text-yellow-600' }
    return { text: 'Over Budget', icon: '✗', color: 'text-red-600' }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Calculate proper date range based on period if not provided
      let budgetStartDate = startDate
      let budgetEndDate = endDate
      
      if (!startDate || !endDate) {
        const now = new Date()
        
        switch(period) {
          case 'weekly':
            // Current week (Monday to Sunday)
            const day = now.getDay()
            const diff = now.getDate() - day + (day === 0 ? -6 : 1)
            budgetStartDate = new Date(now.setDate(diff))
            budgetStartDate.setHours(0, 0, 0, 0)
            budgetEndDate = new Date(budgetStartDate)
            budgetEndDate.setDate(budgetStartDate.getDate() + 6)
            budgetEndDate.setHours(23, 59, 59, 999)
            break
            
          case 'monthly':
            // Current month
            budgetStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
            budgetEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
            break
            
          case 'quarterly':
            // Current quarter
            const quarter = Math.floor(now.getMonth() / 3)
            budgetStartDate = new Date(now.getFullYear(), quarter * 3, 1)
            budgetEndDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999)
            break
            
          case 'yearly':
            // Current year
            budgetStartDate = new Date(now.getFullYear(), 0, 1)
            budgetEndDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
            break
            
          default:
            // Default to current month
            budgetStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
            budgetEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        }
        
        budgetStartDate = budgetStartDate.toISOString()
        budgetEndDate = budgetEndDate.toISOString()
      }
      
      const budgetData = {
        userId,
        category,
        amount: parseFloat(amount),
        period,
        startDate: budgetStartDate,
        endDate: budgetEndDate
      }

      console.log('💾 Creating/Updating budget:', budgetData)

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE || ''}/api/budgets/${editingId}`, budgetData)
        console.log('✅ Budget updated successfully')
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE || ''}/api/budgets`, budgetData)
        console.log('✅ Budget created successfully')
      }

      await fetchBudgets()
      await fetchTransactions()
      resetForm()
      alert(editingId ? 'Budget updated successfully!' : 'Budget created successfully!')
    } catch (err) {
      console.error('❌ Error saving budget:', err)
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
    setCategory('Food')
    setAmount('')
    setPeriod('monthly')
    setStartDate('')
    setEndDate('')
    setShowForm(false)
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + calculateSpent(b), 0)
  const remainingBudget = totalBudget - totalSpent
  
  // Enhanced logging for debugging
  console.log('📊 BUDGET SUMMARY:', {
    totalBudgets: budgets.length,
    totalBudgetAmount: totalBudget,
    totalActualSpent: totalSpent,
    remaining: remainingBudget,
    status: remainingBudget >= 0 ? '✅ Within Budget' : '⚠️ OVER BUDGET',
    budgetDetails: budgets.map(b => ({
      category: b.category,
      budgetLimit: b.amount,
      actualSpent: calculateSpent(b),
      difference: b.amount - calculateSpent(b)
    }))
  })

  return (
    <div className={`min-h-screen py-8 transition-all duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
    }`}>
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className={`text-4xl md:text-5xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Budget Planner
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Create and track budgets for better financial control
          </p>
          <button
            onClick={() => {
              fetchBudgets()
              fetchTransactions()
            }}
            className={`px-6 py-2 border rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
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
          <div className={`border rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`font-semibold text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Total Budget</span>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {currencySymbol}{totalBudget.toLocaleString()}
            </div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Across {budgets.length} categories</div>
          </div>

          {/* Total Spent */}
          <div className={`border rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`font-semibold text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Total Spent</span>
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {currencySymbol}{totalSpent.toLocaleString()}
            </div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget used
            </div>
          </div>

          {/* Remaining */}
          <div className={`rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl ${
            remainingBudget >= 0 
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-300' 
              : 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-orange-300'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white/90">
                {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
              </span>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={remainingBudget >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"} />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">
              {currencySymbol}{Math.abs(remainingBudget).toLocaleString()}
            </div>
            <div className="text-sm text-white/80 font-medium">
              {remainingBudget >= 0 ? 'Available to spend' : 'Exceeding budget'}
            </div>
          </div>
        </div>

        {/* Create Budget Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{showForm ? 'Cancel' : editingId ? 'Edit Budget' : 'Create New Budget'}</span>
          </button>
        </div>

        {/* Budget Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Budget' : 'Create New Budget'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget Amount ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="10000"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>

                {/* Period */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Period
                  </label>
                  <select
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  >
                    {periods.map(p => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>

                {/* End Date */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Budget' : 'Create Budget'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Budget List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Your Budgets ({budgets.length})
          </h2>

          {budgets.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-200">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-4">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                No budgets yet
              </h4>
              <p className="text-gray-600">
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
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{budget.category === 'Food' ? '🍕' : budget.category === 'Transport' ? '🚗' : budget.category === 'Shopping' ? '🛍️' : budget.category === 'Entertainment' ? '🎬' : budget.category === 'Bills' ? '📄' : budget.category === 'Healthcare' ? '⚕️' : budget.category === 'Education' ? '📚' : '💰'}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {budget.category}
                          </h3>
                          <p className="text-sm text-gray-500 font-medium uppercase">
                            {budget.period}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(budget._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
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
                        <span className="text-2xl font-bold text-gray-800">
                          {currencySymbol}{spent.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                          of {currencySymbol}{budget.amount.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(percentage)} transition-all duration-500 rounded-full`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status and Percentage */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center space-x-2 ${status.color} font-semibold`}>
                        <span className="text-lg">{status.icon}</span>
                        <span>{status.text}</span>
                      </div>
                      <span className={`text-2xl font-bold ${status.color}`}>
                        {Math.round(percentage)}%
                      </span>
                    </div>

                    {/* Dates */}
                    {(budget.startDate || budget.endDate) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 font-medium flex items-center justify-between">
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
    </div>
  )
}
