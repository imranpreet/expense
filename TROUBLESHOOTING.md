# 🔧 Troubleshooting Guide

## Current Status

✅ **Backend**: Running on port 4000 (background process)
✅ **Frontend**: Running on port 3002
✅ **MongoDB**: Connected successfully
✅ **API**: Tested and working

## How to Test

### 1. Open the App
Visit: **http://localhost:3002/**

### 2. Open Browser Console
- Press `F12` or right-click → "Inspect"
- Go to "Console" tab
- Keep it open while testing

### 3. Try to Sign Up
1. Click "Get Started"
2. Toggle to "Sign Up" mode
3. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123
4. Click "Create Account"

### 4. Check Console Output
You should see:
```
Making request to: http://localhost:4000/api/auth/signup with body: {...}
Response: {token: "...", user: {...}}
```

## Common Issues & Solutions

### Issue 1: "Network Error" or "Connection Refused"

**Symptom:** Error message says "Something went wrong" or "Network Error"

**Solution:**
```bash
# Check if backend is running
ps aux | grep "node server.js"

# If not running, start it:
cd /home/sama/Desktop/Expense-Tracker/backend
node server.js

# Keep this terminal open!
```

### Issue 2: Backend Keeps Stopping

**Symptom:** Backend works for a moment then stops

**Solution:** Run backend in background
```bash
cd /home/sama/Desktop/Expense-Tracker/backend
node server.js &
```

Or use screen/tmux:
```bash
screen -S backend
cd /home/sama/Desktop/Expense-Tracker/backend
node server.js
# Press Ctrl+A then D to detach
```

### Issue 3: "Email already in use"

**Symptom:** Error says email is already registered

**Solution:** Use a different email or login with existing account
- Click "Already have an account? Sign in"
- Enter your email and password

### Issue 4: Console shows wrong URL

**Symptom:** Console shows request to wrong port or domain

**Check .env file:**
```bash
cat /home/sama/Desktop/Expense-Tracker/frontend/.env
```

Should show:
```
VITE_API_BASE=http://localhost:4000
```

**If wrong, fix it:**
```bash
echo "VITE_API_BASE=http://localhost:4000" > /home/sama/Desktop/Expense-Tracker/frontend/.env
```

**Then restart frontend:**
- Stop frontend (Ctrl+C in terminal)
- Start again: `npm run dev`

### Issue 5: Changes Not Appearing

**Symptom:** Code changes don't show up in browser

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. Clear cache: DevTools → Network tab → Disable cache
3. Restart Vite:
   ```bash
   # In frontend terminal
   Ctrl+C
   npm run dev
   ```

### Issue 6: MongoDB Connection Error

**Symptom:** Backend logs show MongoDB connection error

**Check .env:**
```bash
cat /home/sama/Desktop/Expense-Tracker/backend/.env
```

**Verify MongoDB URI:**
- Should start with `mongodb+srv://`
- Password should be URL-encoded (no `<` `>` brackets)
- Should include database name: `/expense-tracker?`

**Fix if needed:**
```bash
nano /home/sama/Desktop/Expense-Tracker/backend/.env
```

Update:
```bash
MONGO_URI=mongodb+srv://simran24:simran6789g@mycluster.36hc0ze.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=MyCluster
```

### Issue 7: Port Already in Use

**Symptom:** "Port 4000 is already in use"

**Find process:**
```bash
lsof -i :4000
# or
netstat -tlnp | grep 4000
```

**Kill it:**
```bash
kill -9 <PID>
```

**Then restart backend**

### Issue 8: CORS Error

**Symptom:** Console shows "CORS policy blocked"

**Check backend server.js:**
Should have:
```javascript
app.use(cors());
```

**Restart backend after any changes**

## Manual Testing Commands

### Test Backend Directly

**1. Test Signup:**
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Expected output:
```json
{"token":"eyJhbGc...","user":{"id":"...","name":"Test User","email":"test@example.com"}}
```

**2. Test Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**3. Test Get Transactions:**
```bash
# Replace USER_ID with actual user ID from signup response
curl http://localhost:4000/api/transactions/USER_ID
```

## Checking Server Status

### Backend Status
```bash
# Check if running
ps aux | grep "node server.js" | grep -v grep

# Check logs (if running in background with logs)
tail -f /home/sama/Desktop/Expense-Tracker/backend/backend.log

# Check port
netstat -tlnp | grep 4000
```

### Frontend Status
```bash
# Check if running
ps aux | grep vite | grep -v grep

# Check port
netstat -tlnp | grep 3002
```

### MongoDB Connection
```bash
# Test with curl
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"DB Test","email":"dbtest@test.com","password":"test123"}'

# If you get user data back, MongoDB is connected!
```

## Quick Reset

If everything seems broken:

```bash
# 1. Stop everything
pkill -f "node server.js"
pkill -f "vite"

# 2. Restart backend
cd /home/sama/Desktop/Expense-Tracker/backend
node server.js &

# 3. Wait 2 seconds
sleep 2

# 4. Restart frontend
cd /home/sama/Desktop/Expense-Tracker/frontend
npm run dev

# 5. Test backend
curl http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test"}'

# Should return JSON (even if error)

# 6. Open browser
# Visit http://localhost:3002/
# Try to sign up
```

## Debug Mode

I've added console logging to the Login component. When you try to sign up/login, check the browser console for:

```
Making request to: http://localhost:4000/api/auth/signup with body: {name: "...", email: "...", password: "..."}
```

This will show you:
- ✅ What URL is being called
- ✅ What data is being sent
- ✅ Any errors that occur

## Still Having Issues?

### Check These in Order:

1. **Backend Running?**
   ```bash
   curl http://localhost:4000/api/auth/login -d '{}' -H "Content-Type: application/json"
   ```
   Should return JSON (even if error)

2. **Frontend Running?**
   - Visit http://localhost:3002/
   - Should see landing page

3. **Browser Console Clear?**
   - Press F12
   - Check for red errors
   - Look for request URLs

4. **.env Files Correct?**
   ```bash
   # Backend
   cat backend/.env | grep MONGO_URI
   
   # Frontend  
   cat frontend/.env
   ```

5. **Network Tab**
   - F12 → Network tab
   - Try to sign up
   - See if request appears
   - Check request URL
   - Check response

## Environment Variables

### Backend (.env)
```bash
MONGO_URI=mongodb+srv://simran24:simran6789g@mycluster.36hc0ze.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=MyCluster
PORT=4000
JWT_SECRET=f8e3d2c1b0a9876543210fedcba9876543210fedcba9876543210fedcba98
OPENAI_API_KEY=
```

### Frontend (.env)
```bash
VITE_API_BASE=http://localhost:4000
```

## Success Checklist

When everything works:

- [ ] Backend shows "Connected to MongoDB"
- [ ] Backend shows "Server running on port 4000"
- [ ] Frontend shows VITE server at localhost:3002
- [ ] Browser console shows no errors
- [ ] Signup request goes to http://localhost:4000/api/auth/signup
- [ ] Response includes token and user data
- [ ] Dashboard appears after signup
- [ ] Can add expenses
- [ ] Expenses appear in list

---

**If you're still stuck, check the browser console and look for the exact error message!**
