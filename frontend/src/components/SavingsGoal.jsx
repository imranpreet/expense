import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SavingsGoal() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const currencySymbol = localStorage.getItem('currencySymbol') || '$';
  
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    category: 'general'
  });

  const apiUrl = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
  const userId = localStorage.getItem('userId');

  // Listen for theme changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('theme') || 'light';
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [theme]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/savings-goals/user/${userId}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        // Update existing goal
        await axios.put(`${apiUrl}/api/savings-goals/${editingGoal._id}`, {
          ...formData,
          userId
        });
        setEditingGoal(null);
      } else {
        // Create new goal
        await axios.post(`${apiUrl}/api/savings-goals`, {
          ...formData,
          userId
        });
      }
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: 0,
        deadline: '',
        category: 'general'
      });
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Failed to save goal. Please try again.');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline.split('T')[0],
      category: goal.category
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: 0,
      deadline: '',
      category: 'general'
    });
    setShowForm(false);
  };

  const handleAddContribution = async (goalId, amount) => {
    try {
      await axios.patch(`${apiUrl}/api/savings-goals/${goalId}/contribute`, {
        amount: parseFloat(amount)
      });
      fetchGoals();
    } catch (error) {
      console.error('Error adding contribution:', error);
    }
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`${apiUrl}/api/savings-goals/${goalId}`);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'from-green-400 to-emerald-500';
    if (percentage >= 75) return 'from-blue-400 to-cyan-500';
    if (percentage >= 50) return 'from-purple-400 to-pink-500';
    if (percentage >= 25) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const categoryIcons = {
    vacation: '✈️',
    house: '🏠',
    car: '🚗',
    education: '🎓',
    emergency: '🆘',
    general: '💰',
    wedding: '💍',
    gadget: '📱'
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              💎 Savings Goals
            </h1>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Track your financial goals and watch your savings grow
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            New Goal
          </button>
        </div>

        {/* Create/Edit Goal Form */}
        {showForm && (
          <div className={`rounded-2xl shadow-xl p-8 mb-8 border animate-fade-in ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-purple-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {editingGoal ? '✏️ Edit Savings Goal' : '➕ Create New Savings Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Goal Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-400'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-purple-400'
                    }`}
                    placeholder="e.g., Dream Vacation"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-400'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-purple-400'
                    }`}
                  >
                    <option value="general">💰 General</option>
                    <option value="vacation">✈️ Vacation</option>
                    <option value="house">🏠 House</option>
                    <option value="car">🚗 Car</option>
                    <option value="education">🎓 Education</option>
                    <option value="emergency">🆘 Emergency Fund</option>
                    <option value="wedding">💍 Wedding</option>
                    <option value="gadget">📱 Gadget</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Saved Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {editingGoal ? '💾 Update Goal' : '➕ Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysLeft = getDaysRemaining(goal.deadline);
            const isCompleted = progress >= 100;

            return (
              <div
                key={goal._id}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{categoryIcons[goal.category]}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
                      <span className="text-sm text-gray-500 capitalize">{goal.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="text-blue-400 hover:text-blue-600 transition-colors"
                      title="Edit Goal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Delete Goal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-purple-600">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500 rounded-full`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Amount Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Saved</span>
                    <span className="text-lg font-bold text-green-600">{currencySymbol}{goal.currentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target</span>
                    <span className="text-lg font-bold text-gray-800">{currencySymbol}{goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="text-lg font-bold text-orange-600">
                      {currencySymbol}{(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Deadline Info */}
                <div className={`p-3 rounded-xl mb-4 ${daysLeft < 0 ? 'bg-red-50' : daysLeft < 30 ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {daysLeft < 0 ? '⚠️ Overdue' : daysLeft === 0 ? '⏰ Today' : `⏳ ${daysLeft} days left`}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(goal.deadline).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Add Contribution */}
                {!isCompleted && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Add {currencySymbol}"
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          handleAddContribution(goal._id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.parentElement.querySelector('input');
                        if (input.value) {
                          handleAddContribution(goal._id, input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Add
                    </button>
                  </div>
                )}

                {/* Completed Badge */}
                {isCompleted && (
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-center py-3 rounded-xl font-bold">
                    🎉 Goal Achieved!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Savings Goals Yet</h3>
            <p className="text-gray-600 mb-6">Start your savings journey by creating your first goal!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
