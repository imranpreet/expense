# 🍃 MongoDB Atlas Quick Setup

This guide will get your MongoDB database set up in under 5 minutes!

## Step 1: Create Account (1 minute)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign In"**
3. Create account with:
   - Email and password, OR
   - Sign in with Google

## Step 2: Create Cluster (2 minutes)

1. After login, you'll see **"Create a deployment"**
2. Choose **M0 Free** (perfect for development)
3. Configuration:
   - **Provider:** AWS (or any)
   - **Region:** Choose closest to you
   - **Cluster Name:** Keep default or change to "expense-tracker"
4. Click **"Create Deployment"**
5. Wait ~1-2 minutes for cluster creation

## Step 3: Create Database User (1 minute)

You'll see a popup: **"Security Quickstart"**

1. **Create Database User:**
   - Username: `expense_user` (or anything you like)
   - Password: Click **"Autogenerate Secure Password"** (or create your own)
   - ⚠️ **IMPORTANT:** Copy and save this password!
   - Click **"Create User"**

2. **Add Your IP Address:**
   - Choose **"My Local Environment"**
   - Click **"Add My Current IP Address"**
   - Or for development, add **"0.0.0.0/0"** (allows all IPs)
   - Click **"Finish and Close"**

## Step 4: Get Connection String (1 minute)

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Drivers"**
4. Select:
   - **Driver:** Node.js
   - **Version:** Latest (5.5 or higher)
5. Copy the connection string (looks like this):
   ```
   mongodb+srv://expense_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **IMPORTANT:** Replace `<password>` with your actual password!

## Step 5: Configure Your App (30 seconds)

1. Open `backend/.env` file
2. Update the `MONGO_URI` line:
   ```bash
   MONGO_URI=mongodb+srv://expense_user:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```
   
   Note: I added `/expense-tracker` before the `?` to name your database

3. Generate a JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
4. Add it to `.env`:
   ```bash
   JWT_SECRET=the_generated_secret_from_above
   ```

## Complete .env Example

```bash
# MongoDB Connection
MONGO_URI=mongodb+srv://expense_user:SecureP4ssw0rd@cluster0.abc123.mongodb.net/expense-tracker?retryWrites=true&w=majority

# Server Configuration
PORT=4000

# JWT Secret (generated with crypto)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Optional: OpenAI API Key
OPENAI_API_KEY=
```

## Step 6: Test Connection

```bash
cd backend
npm start
```

You should see:
```
Connected to MongoDB ✅
Server running on port 4000 🚀
```

## ✅ Verification Checklist

- [ ] MongoDB cluster created
- [ ] Database user created with password
- [ ] IP address whitelisted (or 0.0.0.0/0 for dev)
- [ ] Connection string copied
- [ ] Password replaced in connection string
- [ ] Database name added to connection string
- [ ] JWT_SECRET generated and added
- [ ] Backend starts without errors
- [ ] "Connected to MongoDB" message appears

## 🔧 Troubleshooting

### Error: "MongoServerError: bad auth"
- ✅ Check password in connection string is correct
- ✅ Password must match the one you created in Atlas
- ✅ No `<` `>` brackets around password

### Error: "connection timed out"
- ✅ Check IP whitelist in MongoDB Atlas
- ✅ Add 0.0.0.0/0 for development
- ✅ Check your internet connection

### Error: "MONGO_URI not set"
- ✅ Make sure `.env` file exists in backend folder
- ✅ Check `.env` has `MONGO_URI=mongodb+srv://...`
- ✅ No spaces around `=`

### Backend starts but can't create users
- ✅ Database user has "Read and write to any database" permissions
- ✅ Connection string includes database name: `/expense-tracker?`

## 🎯 Quick Tips

**Password Special Characters:**
If your password has special characters, URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

**Database Name:**
The `/expense-tracker` in the connection string creates a database called "expense-tracker". You can change this to any name.

**IP Whitelisting:**
- Development: Use `0.0.0.0/0` (all IPs)
- Production: Use specific IP addresses

## 📊 Viewing Your Data

1. Go to MongoDB Atlas Dashboard
2. Click **"Browse Collections"**
3. You'll see:
   - `users` collection (user accounts)
   - `transactions` collection (expenses/income)
   - `budgets` collection (budget limits)

## 🚀 Next Steps

Once you see "Connected to MongoDB":

1. Keep backend running
2. Make sure frontend is running: `npm run dev`
3. Visit http://localhost:3002/
4. Click "Get Started"
5. Sign up for an account
6. Start tracking expenses!

## 📚 Additional Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Connection String Guide](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)

---

**Need help? Check the error messages in your terminal - they're usually very specific about what's wrong!**
