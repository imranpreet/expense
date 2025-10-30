import React, { useState } from 'react'
import axios from 'axios'

const categoryIcons = {
  food: '🍔',
  entertainment: '🎬',
  transport: '🚗',
  shopping: '🛍️',
  bills: '📄',
  salary: '💰',
  freelance: '💼',
  other: '📦'
}

export default function ExpenseForm({ onAdd }){
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const userId = localStorage.getItem('userId')
  const currencySymbol = localStorage.getItem('currencySymbol') || '$'

  async function handleSubmit(e){
    e.preventDefault()
    if(!amount) return
    setLoading(true)
    try{
      const tx = { userId, type, amount: parseFloat(amount), category, notes, date: new Date() }
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || ''}/api/transactions`, tx)
      onAdd(res.data)
      setAmount('')
      setNotes('')
    }catch(err){
      console.error(err)
      alert('Failed to add transaction')
    }finally{
      setLoading(false)
    }
  }

  const expenseCategories = ['food', 'entertainment', 'transport', 'shopping', 'bills', 'other']
  const incomeCategories = ['salary', 'freelance', 'other']
  const categories = type === 'expense' ? expenseCategories : incomeCategories

  return (
    <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Add Transaction</h3>
          <p className="text-sm text-gray-600">Record your income or expense</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex rounded-lg overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => {setType('expense'); setCategory('food')}}
            className={`flex-1 py-3 px-4 font-medium transition-all duration-200 ${
              type === 'expense'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>Expense</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {setType('income'); setCategory('salary')}}
            className={`flex-1 py-3 px-4 font-medium transition-all duration-200 ${
              type === 'income'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>Income</span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount ({currencySymbol})</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">{currencySymbol}</span>
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e=>setAmount(e.target.value)}
                className="input-field pl-8"
                required
              />
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-xl">{categoryIcons[category] || '📦'}</span>
              </div>
              <select
                value={category}
                onChange={e=>setCategory(e.target.value)}
                className="input-field pl-12 appearance-none capitalize"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
          <input
            type="text"
            placeholder="Add description..."
            value={notes}
            onChange={e=>setNotes(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount}
          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Transaction</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
