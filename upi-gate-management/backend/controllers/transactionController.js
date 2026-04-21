const Transaction = require('../models/Transaction');

exports.initiatePayment = async (req, res) => {
    const { upiId, amount } = req.body;
    const txn = new Transaction({ upiId, amount });

    if (!upiId.includes('@')) {
        txn.status = 'Failed';
    } else {
        txn.status = 'Success';
    }

    await txn.save();

    setTimeout(async () => {
        if (txn.status === 'Processing') {
            txn.status = 'Failed';
            await txn.save();
        }
    }, 120000);

    res.json(txn);
};
