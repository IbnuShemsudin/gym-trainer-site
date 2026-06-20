const Payment = require('../models/Payment');
const Member = require('../models/Member');
const MembershipPlan = require('../models/MembershipPlan');

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('memberId', 'firstName lastName email')
            .populate('membershipPlanId', 'name price')
            .populate('recordedBy', 'name');
        res.json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('memberId')
            .populate('membershipPlanId')
            .populate('recordedBy');
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, data: payment });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Record new payment
exports.recordPayment = async (req, res) => {
    try {
        const { memberId, membershipPlanId, amount, paymentMethod, dueDate, notes } = req.body;

        // Verify member exists
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

        // Verify membership plan exists
        const plan = await MembershipPlan.findById(membershipPlanId);
        if (!plan) return res.status(404).json({ success: false, message: 'Membership plan not found' });

        // Generate receipt number
        const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Calculate membership dates
        const startDate = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + plan.duration);

        const payment = new Payment({
            memberId,
            membershipPlanId,
            amount,
            paymentMethod,
            dueDate,
            notes,
            receiptNumber,
            recordedBy: req.user.id,
            membershipStartDate: startDate,
            membershipExpiryDate: expiryDate,
            transactionId: `TXN-${Date.now()}`
        });

        await payment.save();

        // Update member's membership details
        await Member.findByIdAndUpdate(memberId, {
            currentMembershipId: membershipPlanId,
            membershipStartDate: startDate,
            membershipExpiryDate: expiryDate,
            membershipStatus: 'active'
        });

        res.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Update payment
exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, message: 'Payment updated successfully', data: payment });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get payments by member
exports.getPaymentsByMember = async (req, res) => {
    try {
        const payments = await Payment.find({ memberId: req.params.memberId })
            .populate('membershipPlanId')
            .sort({ paymentDate: -1 });
        res.json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get monthly revenue
exports.getMonthlyRevenue = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);

        const revenue = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: startDate, $lt: endDate },
                    paymentStatus: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, data: revenue[0] || { totalRevenue: 0, count: 0 } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get payment history report
exports.getPaymentReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { paymentStatus: 'completed' };

        if (startDate && endDate) {
            query.paymentDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const payments = await Payment.find(query)
            .populate('memberId', 'firstName lastName email')
            .populate('membershipPlanId', 'name price')
            .sort({ paymentDate: -1 });

        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

        res.json({ success: true, data: payments, totalAmount, count: payments.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
