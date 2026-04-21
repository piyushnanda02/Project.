const express = require('express');
const router = express.Router();
const Profit = require('../models/Profit');
const { protect } = require('../middleware/authMiddleware');

// @desc    Add daily profit
// @route   POST /api/profits
router.post('/', protect, async (req, res) => {
    try {
        const { amount, description, category, date } = req.body;

        console.log('📝 Adding profit for user:', req.user._id);
        console.log('Profit data:', { amount, description, category, date });

        // Validation
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid amount'
            });
        }

        const profit = await Profit.create({
            user: req.user._id,
            amount: Number(amount),
            description: description || '',
            category: category || 'sales',
            date: date || new Date()
        });

        console.log('✅ Profit saved successfully:', profit._id);

        res.status(201).json({
            success: true,
            data: profit
        });
    } catch (error) {
        console.error('❌ Add profit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get all profits for logged in user
// @route   GET /api/profits
router.get('/', protect, async (req, res) => {
    try {
        const profits = await Profit.find({ user: req.user._id })
            .sort({ date: -1 });
        
        console.log(`📊 Found ${profits.length} profits for user:`, req.user._id);
        
        res.json({
            success: true,
            data: profits
        });
    } catch (error) {
        console.error('❌ Get profits error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Get profits by date range
// @route   GET /api/profits/range?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/range', protect, async (req, res) => {
    try {
        const { start, end } = req.query;
        
        const query = { user: req.user._id };
        
        if (start && end) {
            query.date = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        }
        
        const profits = await Profit.find(query).sort({ date: 1 });
        
        res.json({
            success: true,
            data: profits
        });
    } catch (error) {
        console.error('❌ Get profits range error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Update profit
// @route   PUT /api/profits/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const profit = await Profit.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!profit) {
            return res.status(404).json({
                success: false,
                message: 'Profit not found'
            });
        }
        
        res.json({
            success: true,
            data: profit
        });
    } catch (error) {
        console.error('❌ Update profit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Delete profit
// @route   DELETE /api/profits/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const profit = await Profit.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        
        if (!profit) {
            return res.status(404).json({
                success: false,
                message: 'Profit not found'
            });
        }
        
        console.log('🗑️ Profit deleted:', profit._id);
        
        res.json({
            success: true,
            message: 'Profit deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete profit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Get profit summary with inflation calculation
// @route   GET /api/profits/summary
router.get('/summary', protect, async (req, res) => {
    try {
        const profits = await Profit.find({ user: req.user._id })
            .sort({ date: 1 });
        
        let totalProfit = 0;
        let dailyAverage = 0;
        let bestDay = null;
        let worstDay = null;
        
        if (profits.length > 0) {
            totalProfit = profits.reduce((sum, p) => sum + p.amount, 0);
            dailyAverage = totalProfit / profits.length;
            
            // Find best and worst day
            bestDay = profits.reduce((max, p) => p.amount > max.amount ? p : max, profits[0]);
            worstDay = profits.reduce((min, p) => p.amount < min.amount ? p : min, profits[0]);
        }
        
        // Inflation calculation (6.5% annual inflation rate)
        const inflationRate = 6.5;
        const monthlyInflation = inflationRate / 12;
        const currentValue = totalProfit;
        const inflationAdjustedValue = currentValue / (1 + monthlyInflation / 100);
        const purchasingPowerLoss = currentValue - inflationAdjustedValue;
        
        // Projected growth with inflation
        const projectedNextMonth = totalProfit * (1 + monthlyInflation / 100);
        const projectedNextYear = totalProfit * (1 + inflationRate / 100);
        
        res.json({
            success: true,
            data: {
                totalProfit,
                dailyAverage,
                bestDay,
                worstDay,
                totalEntries: profits.length,
                inflation: {
                    currentRate: inflationRate,
                    monthlyRate: monthlyInflation,
                    inflationAdjustedValue,
                    purchasingPowerLoss,
                    projectedNextMonth,
                    projectedNextYear
                }
            }
        });
    } catch (error) {
        console.error('❌ Get summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;