// routes/admin.js
const express = require("express");
const router = express.Router();



router.delete('/fix-order-index', async (req, res) => {
  try {
    const result = await db.collection('orders').dropIndex('orderId_1');
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;
