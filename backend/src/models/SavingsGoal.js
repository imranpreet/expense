const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['vacation', 'house', 'car', 'education', 'emergency', 'general', 'wedding', 'gadget'],
    default: 'general'
  },
  contributions: [{
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for progress percentage
savingsGoalSchema.virtual('progress').get(function() {
  return (this.currentAmount / this.targetAmount) * 100;
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
