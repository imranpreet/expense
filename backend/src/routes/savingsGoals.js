const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');

// Get all goals for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single goal
router.get('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new goal
router.post('/', async (req, res) => {
  const goal = new SavingsGoal({
    userId: req.body.userId,
    name: req.body.name,
    targetAmount: req.body.targetAmount,
    currentAmount: req.body.currentAmount || 0,
    deadline: req.body.deadline,
    category: req.body.category || 'general'
  });

  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add contribution to goal
router.patch('/:id/contribute', async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.currentAmount += req.body.amount;
    goal.contributions.push({
      amount: req.body.amount,
      date: new Date()
    });

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update goal
router.put('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (req.body.name) goal.name = req.body.name;
    if (req.body.targetAmount) goal.targetAmount = req.body.targetAmount;
    if (req.body.currentAmount !== undefined) goal.currentAmount = req.body.currentAmount;
    if (req.body.deadline) goal.deadline = req.body.deadline;
    if (req.body.category) goal.category = req.body.category;

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
