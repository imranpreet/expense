import { useState, useEffect } from 'react';
import axios from 'axios';

function Settings() {
  const [activeTab, setActiveTab] = useState('theme');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: null
  });
  
  // Currency Settings State
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem('preferredCurrency') || 'USD'
  );
  const [currencies] = useState([
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  ]);

  useEffect(() => {
    // Load user profile data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setProfileData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save currency preference
  const handleCurrencyChange = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    localStorage.setItem('preferredCurrency', currencyCode);
    
    // Also save the currency symbol for easy access
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      localStorage.setItem('currencySymbol', currency.symbol);
    }
    
    alert(`Currency changed to ${currencyCode}! Your expenses will now be tracked in ${currencyCode}.`);
  };

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        avatar: file
      }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', profileData.fullName);
      formData.append('email', profileData.email);
      if (profileData.currentPassword) {
        formData.append('currentPassword', profileData.currentPassword);
      }
      if (profileData.newPassword) {
        formData.append('newPassword', profileData.newPassword);
      }
      if (profileData.avatar) {
        formData.append('avatar', profileData.avatar);
      }

      await axios.put('http://localhost:4000/api/user/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Profile updated successfully!');
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} transition-all duration-500`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            ⚙️ Settings
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Customize your experience
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'theme', label: 'Theme', icon: '🎨' },
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'currency', label: 'Currency', icon: '�' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-purple-600 text-white shadow-lg'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-2xl p-8`}>
          
          {/* Theme Settings */}
          {activeTab === 'theme' && (
            <div className="space-y-8">
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                🎨 Appearance Settings
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Light Theme Preview */}
                <div
                  onClick={() => setTheme('light')}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                    theme === 'light'
                      ? 'border-purple-500 shadow-2xl shadow-purple-500/50 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {theme === 'light' && (
                    <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-full font-bold z-10 shadow-lg">
                      ✓ Active
                    </div>
                  )}
                  <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">☀️ Light Theme</h3>
                    <p className="text-gray-600 mb-6">Clean and bright interface for daytime use</p>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 shadow">
                        <div className="h-3 bg-purple-500 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow">
                        <div className="h-3 bg-blue-500 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dark Theme Preview */}
                <div
                  onClick={() => setTheme('dark')}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/50 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {theme === 'dark' && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full font-bold z-10 shadow-lg">
                      ✓ Active
                    </div>
                  )}
                  <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">🌙 Dark Blue Theme</h3>
                    <p className="text-gray-300 mb-6">Elegant dark interface for comfortable viewing</p>
                    <div className="space-y-3">
                      <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
                        <div className="h-3 bg-blue-500 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
                        <div className="h-3 bg-cyan-500 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Toggle Button */}
              <div className="flex items-center justify-center pt-8">
                <button
                  onClick={handleThemeToggle}
                  className={`relative inline-flex items-center px-12 py-6 rounded-full transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  } text-white font-bold text-xl shadow-2xl hover:scale-105`}
                >
                  <span className="text-3xl mr-3">{theme === 'dark' ? '🌙' : '☀️'}</span>
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
                </button>
              </div>
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                👤 Profile Settings
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                    {profileData.fullName.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Change Avatar
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none`}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      required
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none`}
                    />
                  </div>
                </div>

                {/* Password Change Section */}
                <div className={`p-6 rounded-2xl border-2 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    🔒 Change Password
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={profileData.currentPassword}
                        onChange={handleProfileChange}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          theme === 'dark'
                            ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={profileData.newPassword}
                        onChange={handleProfileChange}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          theme === 'dark'
                            ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleProfileChange}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          theme === 'dark'
                            ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none`}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Currency Settings */}
          {activeTab === 'currency' && (
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  � Currency Settings
                </h2>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select your preferred currency for tracking expenses
                </p>
              </div>

              {/* Current Currency Display */}
              <div className={`p-8 rounded-2xl ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-blue-900 to-slate-800 border-2 border-blue-700' 
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300'
              } shadow-2xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Current Currency
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-6xl">
                        {currencies.find(c => c.code === selectedCurrency)?.flag}
                      </span>
                      <div>
                        <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedCurrency}
                        </p>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {currencies.find(c => c.code === selectedCurrency)?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right px-8 py-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-white'
                  } shadow-xl`}>
                    <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Symbol
                    </p>
                    <p className={`text-5xl font-bold ${
                      theme === 'dark' ? 'text-blue-400' : 'text-purple-600'
                    }`}>
                      {currencies.find(c => c.code === selectedCurrency)?.symbol}
                    </p>
                  </div>
                </div>
              </div>

              {/* Currency Selection Grid */}
              <div>
                <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  📋 Select Your Currency
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currencies.map(currency => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencyChange(currency.code)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedCurrency === currency.code
                          ? theme === 'dark'
                            ? 'bg-blue-900 border-blue-500 shadow-xl shadow-blue-500/50 scale-105'
                            : 'bg-purple-100 border-purple-500 shadow-xl shadow-purple-500/50 scale-105'
                          : theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500'
                          : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {selectedCurrency === currency.code && (
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-5xl mb-3">{currency.flag}</div>
                        <p className={`text-2xl font-bold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {currency.symbol}
                        </p>
                        <p className={`text-lg font-semibold mb-1 ${
                          theme === 'dark' ? 'text-blue-300' : 'text-purple-600'
                        }`}>
                          {currency.code}
                        </p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {currency.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className={`p-6 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-blue-900/50 border-2 border-blue-700' 
                    : 'bg-blue-50 border-2 border-blue-300'
                }`}>
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Unified Tracking
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    All your expenses will be tracked in your selected currency
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-green-900/50 border-2 border-green-700' 
                    : 'bg-green-50 border-2 border-green-300'
                }`}>
                  <div className="text-4xl mb-3">📊</div>
                  <h4 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Easy Reports
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    View all reports and analytics in your preferred currency
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-purple-900/50 border-2 border-purple-700' 
                    : 'bg-purple-50 border-2 border-purple-300'
                }`}>
                  <div className="text-4xl mb-3">🌍</div>
                  <h4 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    18+ Currencies
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Support for major currencies from around the world
                  </p>
                </div>
              </div>

              {/* Usage Note */}
              <div className={`p-6 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-900 to-blue-900 border-2 border-cyan-700'
                  : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">�</div>
                  <div>
                    <h4 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      How It Works
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      When you add expenses, budgets, or savings goals, they will be tracked in your selected currency. 
                      You can change your currency anytime, and the symbol will update across the application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
