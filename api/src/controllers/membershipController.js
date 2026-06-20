const MembershipPlan = require('../models/MembershipPlan');

// Get all membership plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await MembershipPlan.find().sort({ price: 1 });
        res.json({ success: true, data: plans });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get active membership plans
exports.getActivePlans = async (req, res) => {
    try {
        const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });
        res.json({ success: true, data: plans });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get membership plan by ID
exports.getPlanById = async (req, res) => {
    try {
        const plan = await MembershipPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Membership plan not found' });
        res.json({ success: true, data: plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Create membership plan
exports.createPlan = async (req, res) => {
    try {
        const { name, duration, price, currency, description, features, planType, maxTrainingSessions, discountPercentage } = req.body;

        const plan = new MembershipPlan({
            name,
            duration,
            price,
            currency: currency || 'ETB',
            description,
            features: features || [],
            planType: planType || 'monthly',
            maxTrainingSessions,
            discountPercentage: discountPercentage || 0
        });

        await plan.save();
        res.status(201).json({ success: true, message: 'Membership plan created successfully', data: plan });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Update membership plan
exports.updatePlan = async (req, res) => {
    try {
        const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!plan) return res.status(404).json({ success: false, message: 'Membership plan not found' });
        res.json({ success: true, message: 'Membership plan updated successfully', data: plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete membership plan
exports.deletePlan = async (req, res) => {
    try {
        const plan = await MembershipPlan.findByIdAndDelete(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Membership plan not found' });
        res.json({ success: true, message: 'Membership plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get plans by type
exports.getPlansByType = async (req, res) => {
    try {
        const { type } = req.params;
        const plans = await MembershipPlan.find({ planType: type, isActive: true });
        res.json({ success: true, data: plans });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Deactivate plan
exports.deactivatePlan = async (req, res) => {
    try {
        const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!plan) return res.status(404).json({ success: false, message: 'Membership plan not found' });
        res.json({ success: true, message: 'Membership plan deactivated', data: plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Activate plan
exports.activatePlan = async (req, res) => {
    try {
        const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
        if (!plan) return res.status(404).json({ success: false, message: 'Membership plan not found' });
        res.json({ success: true, message: 'Membership plan activated', data: plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
