const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Create
router.post('/', async (req, res) => {
  try {
    const tx = new Transaction(req.body);
    await tx.save();
    res.json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read (by user)
router.get('/user/:userId', async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const tx = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
