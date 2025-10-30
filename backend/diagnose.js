// Quick diagnostic to check transactions and budgets
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/expense-tracker')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    // Transaction schema
    const Transaction = mongoose.model('Transaction', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      type: String,
      category: String,
      amount: Number,
      description: String,
      date: Date
    }));
    
    // Budget schema
    const Budget = mongoose.model('Budget', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      category: String,
      amount: Number,
      period: String,
      startDate: Date,
      endDate: Date
    }));
    
    // Get all users' data
    const transactions = await Transaction.find().sort({ date: -1 });
    const budgets = await Budget.find();
    
    console.log('='.repeat(60));
    console.log('📊 DATABASE ANALYSIS');
    console.log('='.repeat(60));
    
    console.log('\n💳 TRANSACTIONS:', transactions.length, 'total');
    console.log('-'.repeat(60));
    
    if (transactions.length === 0) {
      console.log('⚠️  NO TRANSACTIONS FOUND!');
      console.log('   You need to add transactions in the Dashboard first.');
    } else {
      transactions.forEach((t, i) => {
        console.log(`${i + 1}. ${t.type.toUpperCase()} | ${t.category} | $${t.amount}`);
        console.log(`   Date: ${t.date.toLocaleDateString()} | UserID: ${t.userId}`);
      });
    }
    
    console.log('\n🎯 BUDGETS:', budgets.length, 'total');
    console.log('-'.repeat(60));
    
    if (budgets.length === 0) {
      console.log('⚠️  NO BUDGETS FOUND!');
    } else {
      budgets.forEach((b, i) => {
        console.log(`${i + 1}. ${b.category} | Budget: $${b.amount} | Period: ${b.period}`);
        console.log(`   Period: ${b.startDate?.toLocaleDateString()} to ${b.endDate?.toLocaleDateString()}`);
        console.log(`   UserID: ${b.userId}`);
        
        // Find matching transactions
        const matches = transactions.filter(t => 
          String(t.userId) === String(b.userId) &&
          t.type === 'expense' &&
          t.category.toLowerCase().trim() === b.category.toLowerCase().trim()
        );
        
        const totalSpent = matches.reduce((sum, t) => sum + t.amount, 0);
        
        console.log(`   Matching transactions: ${matches.length} (Total: $${totalSpent})`);
        matches.forEach(m => {
          console.log(`     - ${m.category} $${m.amount} on ${m.date.toLocaleDateString()}`);
        });
      });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🔍 DIAGNOSIS:');
    console.log('='.repeat(60));
    
    if (transactions.length === 0) {
      console.log('❌ Problem: No transactions in database');
      console.log('✅ Solution: Add expense transactions in Dashboard');
      console.log('   Example: Type: Expense, Category: Food, Amount: 500');
    } else if (budgets.length === 0) {
      console.log('✅ Transactions found:', transactions.length);
      console.log('❌ Problem: No budgets created yet');
      console.log('✅ Solution: Budget already exists, check userId matching');
    } else {
      // Check userId matching
      const budgetUserIds = budgets.map(b => String(b.userId));
      const transactionUserIds = [...new Set(transactions.map(t => String(t.userId)))];
      
      console.log('Budget UserIDs:', budgetUserIds);
      console.log('Transaction UserIDs:', transactionUserIds);
      
      const match = budgetUserIds.some(bid => transactionUserIds.includes(bid));
      
      if (!match) {
        console.log('❌ Problem: UserIDs do not match!');
        console.log('   Budgets and transactions belong to different users');
        console.log('✅ Solution: Make sure you\'re logged in as the same user');
      } else {
        console.log('✅ UserIDs match!');
        console.log('✅ Transactions and budgets should be working');
      }
    }
    
    console.log('='.repeat(60));
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
