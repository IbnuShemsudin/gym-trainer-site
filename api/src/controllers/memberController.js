const Member = require('../models/Member');
const User = require('../models/User');

// Get all members
exports.getAllMembers = async (req, res) => {
    try {
        const members = await Member.find()
            .populate('userId', 'name email phone')
            .populate('currentMembershipId')
            .populate('assignedTrainerId', 'firstName lastName');
        res.json({ success: true, data: members });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get member by ID
exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id)
            .populate('userId')
            .populate('currentMembershipId')
            .populate('assignedTrainerId');
        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
        res.json({ success: true, data: member });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Create new member
exports.createMember = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dateOfBirth, gender, address, city, state, zipCode, emergencyContact, emergencyPhone, height, weight, targetWeight, fitnessGoals } = req.body;

        // Check if member email already exists
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ success: false, message: 'Member with this email already exists' });
        }

        const member = new Member({
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            gender,
            address,
            city,
            state,
            zipCode,
            emergencyContact,
            emergencyPhone,
            height,
            weight,
            targetWeight,
            fitnessGoals: fitnessGoals || []
        });

        await member.save();
        res.status(201).json({ success: true, message: 'Member created successfully', data: member });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Update member
exports.updateMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
        res.json({ success: true, message: 'Member updated successfully', data: member });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete member
exports.deleteMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
        res.json({ success: true, message: 'Member deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Search members
exports.searchMembers = async (req, res) => {
    try {
        const { query } = req.query;
        const members = await Member.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ]
        });
        res.json({ success: true, data: members });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get active members
exports.getActiveMembers = async (req, res) => {
    try {
        const members = await Member.find({ isActive: true, membershipStatus: 'active' });
        res.json({ success: true, data: members, count: members.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get expired members
exports.getExpiredMembers = async (req, res) => {
    try {
        const today = new Date();
        const members = await Member.find({ membershipExpiryDate: { $lt: today } });
        res.json({ success: true, data: members, count: members.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Assign trainer to member
exports.assignTrainer = async (req, res) => {
    try {
        const { trainerId } = req.body;
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            { assignedTrainerId: trainerId },
            { new: true }
        ).populate('assignedTrainerId');
        res.json({ success: true, message: 'Trainer assigned successfully', data: member });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
