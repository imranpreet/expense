// Complete setup: Create user, transactions, and budget
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/expense-tracker')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    // User schema
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String
    }));
    
    // Create or get user
    let user = await User.findOne({ email: 'test@test.com' });
    
    if (!user) {
      console.log('👤 Creating test user...');
      const hashedPassword = await bcrypt.hash('123456', 10);
      user = await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: hashedPassword
      });
      console.log('✅ Created user: Test User (test@test.com, password: 123456)\n');
    } else {
      console.log(`✅ Using existing user: ${user.name} (${user.email})\n`);
    }
    
    console.log(`User ID: ${user._id}\n`);
    
    // Transaction schema
    const Transaction = mongoose.model('Transaction', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      type: String,
      category: String,
      amount: Number,
      description: String,
      date: Date
    }));
    
    // Create sample transactions
    const today = new Date();
    const sampleTransactions = [
      {
        userId: user._id,
        type: 'income',
        category: 'Salary',
        amount: 3000,
        description: 'Monthly salary',
        date: today
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Food',
        amount: 500,
        description: 'Groceries week 1',
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Food',
        amount: 400,
        description: 'Restaurant dining',
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Food',
        amount: 600,
        description: 'Groceries week 2',
        date: today
      }
    ];
    
    console.log('💳 Adding sample transactions...');
    await Transaction.deleteMany({ userId: user._id }); // Clear old data
    await Transaction.insertMany(sampleTransactions);
    console.log('✅ Added', sampleTransactions.length, 'transactions\n');
    
    sampleTransactions.forEach(t => {
      console.log(`  ${t.type.toUpperCase()}: ${t.category} - $${t.amount} - ${t.description}`);
    });
    
    const totalIncome = sampleTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = sampleTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const foodExpense = sampleTransactions.filter(t => t.type === 'expense' && t.category === 'Food').reduce((sum, t) => sum + t.amount, 0);
    
    console.log('\n📊 Transaction Summary:');
    console.log(`  Income: $${totalIncome}`);
    console.log(`  Total Expenses: $${totalExpense}`);
    console.log(`  Food Expenses: $${foodExpense}`);
    console.log(`  Balance: $${totalIncome - totalExpense}\n`);
    
    // Now create a budget
    const Budget = mongoose.model('Budget', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      category: String,
      amount: Number,
      period: String,
      startDate: Date,
      endDate: Date
    }));
    
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    
    const foodBudget = {
      userId: user._id,
      category: 'Food',
      amount: 1000,
      period: 'monthly',
      startDate: firstDay,
      endDate: lastDay
    };
    
    console.log('🎯 Creating Food budget...');
    await Budget.deleteMany({ userId: user._id, category: 'Food' }); // Clear old budget
    await Budget.create(foodBudget);
    console.log(`✅ Created Food budget: $1,000/month (${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()})\n`);
    
    console.log('='.repeat(70));
    console.log('🎉 TEST DATA CREATED SUCCESSFULLY!');
    console.log('='.repeat(70));
    
    console.log('\n📝 LOGIN CREDENTIALS:');
    console.log('  Email: test@test.com');
    console.log('  Password: 123456');
    
    console.log('\n📊 Expected Results in Budget Page:');
    console.log('  Total Budget: $1,000');
    console.log(`  Total Spent: $${foodExpense} (from ${sampleTransactions.filter(t => t.type === 'expense' && t.category === 'Food').length} Food transactions)`);
    console.log(`  Remaining: $${1000 - foodExpense} ${foodExpense > 1000 ? '(⚠️ OVER BUDGET by $' + (foodExpense - 1000) + ')' : '(✅ Within budget)'}`);
    
    console.log('\n  Food Budget Card will show:');
    console.log(`    Spent: $${foodExpense}`);
    console.log('    Budget: $1,000');
    console.log(`    Progress: ${Math.round((foodExpense / 1000) * 100)}%`);
    console.log(`    Status: ${foodExpense > 1000 ? '✗ Over Budget (RED)' : foodExpense > 750 ? '⚠ Warning (YELLOW)' : '✓ On Track (GREEN)'}`);
    
    console.log('\n🌐 Next Steps:');
    console.log('  1. Go to http://localhost:3001');
    console.log('  2. Login with: test@test.com / 123456');
    console.log('  3. Go to Budget tab');
    console.log('  4. See your Food budget tracking actual expenses!');
    console.log('  5. Open Console (F12) to see detailed calculation logs');
    console.log('\n' + '='.repeat(70) + '\n');
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
