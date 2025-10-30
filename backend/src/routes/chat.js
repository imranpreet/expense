const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const OpenAI = require('openai');

async function summarizeUserData(userId) {
  const txs = await Transaction.find({ userId }).lean();
  const summary = { totalExpense: 0, totalIncome: 0, byCategory: {} };
  for (const t of txs) {
    if (t.type === 'expense') {
      summary.totalExpense += t.amount;
      summary.byCategory[t.category] = (summary.byCategory[t.category] || 0) + t.amount;
    } else if (t.type === 'income') {
      summary.totalIncome += t.amount;
    }
  }
  summary.mostExpensiveCategory = Object.entries(summary.byCategory).sort((a,b)=>b[1]-a[1])[0] || null;
  return summary;
}

// POST /api/chat/query
// body: { userId, message }
router.post('/query', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ error: 'Missing userId or message' });
  try {
    const summary = await summarizeUserData(userId);

    // Basic rule-based replies using real data to avoid hallucination when no AI key
    const lower = message.toLowerCase();
    let reply = '';
    if (lower.includes('how much') && lower.includes('food')) {
      const food = summary.byCategory['food'] || summary.byCategory['Food'] || 0;
      reply = `You've spent ₹${food} on food so far.`;
    } else if (lower.includes('biggest') || lower.includes('highest')) {
      if (summary.mostExpensiveCategory) {
        reply = `Your biggest expense category is ${summary.mostExpensiveCategory[0]} with ₹${summary.mostExpensiveCategory[1]}.`;
      } else {
        reply = 'No expenses found yet.';
      }
    } else if (lower.includes('summary') || lower.includes('overview')) {
      reply = `Total expenses: ₹${summary.totalExpense}. Total income: ₹${summary.totalIncome}.`;
    } else {
      // If OPENAI_API_KEY is configured, forward to OpenAI with summary context
      if (process.env.OPENAI_API_KEY) {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const system = `You are a helpful personal finance assistant. Use the following user data strictly to answer: ${JSON.stringify(summary)}`;
        const resp = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: message }
          ],
          max_tokens: 400
        });
        reply = resp.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      } else {
        reply = "I can answer common questions like 'How much did I spend on X this month?' or 'What's my biggest expense category?'. For deeper answers, set OPENAI_API_KEY in the backend.\n" +
          `Quick totals: expenses ₹${summary.totalExpense}, income ₹${summary.totalIncome}.`;
      }
    }

    res.json({ reply, source: 'data-driven' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
