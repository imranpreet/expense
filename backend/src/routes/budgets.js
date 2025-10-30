const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Create a new budget
router.post('/', async (req, res) => {
  try {
    const b = new Budget(req.body);
    await b.save();
    res.json(b);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all budgets for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.params.userId });
    res.json(budgets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a budget
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
