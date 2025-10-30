#!/bin/bash

echo "🔍 Checking Expense Tracker Status..."
echo ""

# Check Backend
echo "📡 Backend Status:"
BACKEND_PID=$(ps aux | grep "[n]ode server.js" | awk '{print $2}')
if [ -n "$BACKEND_PID" ]; then
    echo "  ✅ Backend is running (PID: $BACKEND_PID)"
    
    # Test backend API
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{}' 2>/dev/null)
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "400" ]; then
        echo "  ✅ Backend API responding (HTTP $RESPONSE)"
    else
        echo "  ⚠️  Backend not responding on port 4000"
    fi
else
    echo "  ❌ Backend is NOT running"
    echo "     Start with: cd backend && node server.js &"
fi

echo ""

# Check Frontend
echo "🎨 Frontend Status:"
FRONTEND_PID=$(ps aux | grep "[v]ite" | grep Expense-Tracker | awk '{print $2}')
if [ -n "$FRONTEND_PID" ]; then
    echo "  ✅ Frontend is running (PID: $FRONTEND_PID)"
    
    # Check which port
    if netstat -tlnp 2>/dev/null | grep -q ":3002.*$FRONTEND_PID" || ss -tlnp 2>/dev/null | grep -q ":3002.*pid=$FRONTEND_PID"; then
        echo "  ✅ Frontend available at http://localhost:3002/"
    elif netstat -tlnp 2>/dev/null | grep -q ":3000.*$FRONTEND_PID" || ss -tlnp 2>/dev/null | grep -q ":3000.*pid=$FRONTEND_PID"; then
        echo "  ✅ Frontend available at http://localhost:3000/"
    else
        echo "  ℹ️  Frontend running (check terminal for port)"
    fi
else
    echo "  ❌ Frontend is NOT running"
    echo "     Start with: cd frontend && npm run dev"
fi

echo ""

# Check MongoDB connection
echo "🍃 MongoDB Status:"
if [ -f "backend/.env" ]; then
    if grep -q "MONGO_URI=mongodb+srv://" backend/.env; then
        echo "  ✅ MongoDB URI configured"
    else
        echo "  ⚠️  MongoDB URI may not be configured correctly"
    fi
else
    echo "  ❌ backend/.env file not found"
fi

echo ""

# Check environment files
echo "📁 Configuration Files:"
if [ -f "backend/.env" ]; then
    echo "  ✅ backend/.env exists"
else
    echo "  ❌ backend/.env missing"
fi

if [ -f "frontend/.env" ]; then
    echo "  ✅ frontend/.env exists"
    if grep -q "VITE_API_BASE=http://localhost:4000" frontend/.env; then
        echo "     ✅ API base URL configured correctly"
    else
        echo "     ⚠️  API base URL may be wrong"
    fi
else
    echo "  ❌ frontend/.env missing"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
if [ -n "$BACKEND_PID" ] && [ -n "$FRONTEND_PID" ]; then
    echo "✅ System Status: ALL SYSTEMS GO!"
    echo ""
    echo "🚀 Ready to use:"
    echo "   • Open http://localhost:3002/ in your browser"
    echo "   • Click 'Get Started'"
    echo "   • Sign up for an account"
    echo "   • Start tracking expenses!"
elif [ -z "$BACKEND_PID" ] && [ -n "$FRONTEND_PID" ]; then
    echo "⚠️  System Status: FRONTEND ONLY"
    echo ""
    echo "🔧 To fix:"
    echo "   cd /home/sama/Desktop/Expense-Tracker/backend"
    echo "   node server.js &"
elif [ -n "$BACKEND_PID" ] && [ -z "$FRONTEND_PID" ]; then
    echo "⚠️  System Status: BACKEND ONLY"
    echo ""
    echo "🔧 To fix:"
    echo "   cd /home/sama/Desktop/Expense-Tracker/frontend"
    echo "   npm run dev"
else
    echo "❌ System Status: NOTHING RUNNING"
    echo ""
    echo "🔧 To start everything:"
    echo "   # Terminal 1 - Backend:"
    echo "   cd /home/sama/Desktop/Expense-Tracker/backend"
    echo "   node server.js"
    echo ""
    echo "   # Terminal 2 - Frontend:"
    echo "   cd /home/sama/Desktop/Expense-Tracker/frontend"
    echo "   npm run dev"
fi

echo ""
