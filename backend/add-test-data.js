// Add sample transactions and budget for testing
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/expense-tracker')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    // Get current user (assuming you're logged in as 'chumu')
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String
    }));
    
    const user = await User.findOne({ name: 'chumu' });
    
    if (!user) {
      console.log('❌ User "chumu" not found!');
      console.log('Please create a user first by logging in to the app.');
      mongoose.connection.close();
      return;
    }
    
    console.log(`✅ Found user: ${user.name} (ID: ${user._id})\n`);
    
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
        date: today
      },
      {
        userId: user._id,
        type: 'expense',
        category: 'Food',
        amount: 400,
        description: 'Restaurant dining',
        date: today
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
    
    console.log('\n📊 Summary:');
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
    console.log('✅ Created Food budget: $1,000/month\n');
    
    console.log('='.repeat(60));
    console.log('🎉 TEST DATA CREATED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Expected Results in Budget Page:');
    console.log('  Total Budget: $1,000');
    console.log(`  Total Spent: $${foodExpense} (from Food transactions)`);
    console.log(`  Remaining: $${1000 - foodExpense} (${foodExpense > 1000 ? '⚠️ OVER BUDGET!' : '✅ Within budget'})`);
    console.log('\n  Food Budget Card:');
    console.log(`    Spent: $${foodExpense}`);
    console.log('    Budget: $1,000');
    console.log(`    Progress: ${Math.round((foodExpense / 1000) * 100)}%`);
    console.log(`    Status: ${foodExpense > 1000 ? '✗ Over Budget (RED)' : '✓ On Track'}`);
    console.log('\n🌐 Now refresh http://localhost:3001 to see the results!\n');
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
