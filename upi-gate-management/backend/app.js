const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Schema for Transactions
const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true },
  upiId: String,
  amount: Number,
  customerName: String,
  email: String,
  mobile: String,
  paymentMethod: String,
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  bankTransactionId: String,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  errorMessage: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Generate unique transaction ID
function generateTransactionId() {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// API: Initiate Payment
app.post('/api/payment/initiate', async (req, res) => {
  const { upiId, amount, customerName, email, mobile, paymentMethod } = req.body;
  
  console.log('📥 Payment request:', { upiId, amount, customerName, paymentMethod });
  
  // Validate UPI ID format
  if (paymentMethod === 'upi' && (!upiId || !upiId.includes('@'))) {
    return res.status(400).json({ success: false, message: 'Invalid UPI ID format. Use format: name@bank' });
  }
  
  // Validate amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Please enter a valid amount' });
  }
  
  try {
    const transactionId = generateTransactionId();
    
    // Save to database
    const transaction = new Transaction({
      transactionId: transactionId,
      upiId: upiId || 'N/A',
      amount: amount,
      customerName: customerName,
      email: email,
      mobile: mobile,
      paymentMethod: paymentMethod,
      status: 'pending',
      createdAt: new Date()
    });
    
    await transaction.save();
    console.log(`💾 Transaction saved to DB: ${transactionId}`);
    
    // Simulate payment processing (2-5 seconds)
    setTimeout(async () => {
      try {
        const isSuccess = Math.random() < 0.7; // 70% success rate
        const finalStatus = isSuccess ? 'success' : 'failed';
        const bankTxnId = isSuccess ? `BANK${Date.now()}${Math.floor(Math.random()*1000)}` : null;
        
        // Update database with result
        await Transaction.findOneAndUpdate(
          { transactionId: transactionId },
          {
            status: finalStatus,
            bankTransactionId: bankTxnId,
            completedAt: new Date(),
            errorMessage: isSuccess ? null : 'Insufficient funds / UPI limit exceeded'
          }
        );
        
        console.log(`✅ Payment ${finalStatus.toUpperCase()} | DB Updated | Txn: ${transactionId}`);
      } catch (dbError) {
        console.error('❌ DB Update Error:', dbError);
      }
    }, 2000 + Math.random() * 3000);
    
    // Return immediate response
    res.json({
      success: true,
      transactionId: transactionId,
      amount: amount,
      message: `Payment of ₹${amount} initiated. Processing within 2 minutes...`
    });
    
  } catch (error) {
    console.error('❌ Transaction save error:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate payment' });
  }
});

// API: Check Payment Status
app.get('/api/payment/status/:transactionId', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.transactionId });
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    
    res.json({
      success: true,
      status: transaction.status,
      transactionId: transaction.transactionId,
      bankTransactionId: transaction.bankTransactionId,
      amount: transaction.amount,
      message: transaction.status === 'success' ? '✅ Payment successful!' : 
                transaction.status === 'failed' ? '❌ Payment failed' : '⏳ Processing...',
      errorMessage: transaction.errorMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API: Get All Transactions (for admin/demo)
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(50);
    res.json({
      success: true,
      count: transactions.length,
      transactions: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API: Get Transaction Stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const successfulTransactions = await Transaction.countDocuments({ status: 'success' });
    const failedTransactions = await Transaction.countDocuments({ status: 'failed' });
    const totalAmount = await Transaction.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        total: totalTransactions,
        success: successfulTransactions,
        failed: failedTransactions,
        totalAmount: totalAmount[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve HTML for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/upi_gateway';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database: upi_gateway');
    console.log('📁 Collection: transactions');
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║     🚀 UPI GATEWAY MANAGEMENT SYSTEM 🚀                 ║
╠══════════════════════════════════════════════════════════╣
║  📱 Frontend: http://localhost:${PORT}                    ║
║  🔌 API: http://localhost:${PORT}/api                     ║
║  📊 Transactions: http://localhost:${PORT}/api/transactions ║
║  📈 Stats: http://localhost:${PORT}/api/stats             ║
╠══════════════════════════════════════════════════════════╣
║  ✅ Database: MongoDB (upi_gateway)                     ║
║  💰 Custom amount supported                             ║
║  ⏱️  2-minute processing window                          ║
║  🎲 70% success rate                                     ║
╚══════════════════════════════════════════════════════════╝
  `);
});