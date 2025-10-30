import React, { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Chat from './components/Chat'
import Budget from './components/Budget'
import SavingsGoal from './components/SavingsGoal'
import Settings from './components/Settings'
import Navbar from './components/Navbar'

export default function App(){
  const [user, setUser] = useState(null)
  const [view, setView] = useState('dashboard')
  const [showLanding, setShowLanding] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(()=>{
    const userId = localStorage.getItem('userId')
    const userName = localStorage.getItem('userName')
    if(userId && userName){
      setUser({ id: userId, name: userName })
      setShowLanding(false)
    }
    
    // Listen for theme changes
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('theme') || 'light'
      if (currentTheme !== theme) {
        setTheme(currentTheme)
        if (currentTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }, 500)
    
    return () => clearInterval(interval)
  },[theme])

  function handleGetStarted(){
    setShowLanding(false)
    setShowLogin(true)
  }

  function handleLogin(userData){
    setUser(userData)
    setShowLogin(false)
  }

  function handleLogout(){
    localStorage.clear()
    setUser(null)
    setShowLanding(true)
    setShowLogin(false)
  }

  if(showLanding){
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if(showLogin){
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        currentPage={view}
        onNavigate={setView}
        onLogout={handleLogout}
        userName={user.name}
      />

      <main>
        {view === 'dashboard' && <Dashboard userId={user.id} userName={user.name} />}
        {view === 'budget' && <Budget userId={user.id} />}
        {view === 'savings' && <SavingsGoal userId={user.id} />}
        {view === 'chat' && <Chat userId={user.id} userName={user.name} />}
        {view === 'settings' && <Settings />}
      </main>
    </div>
  )
}