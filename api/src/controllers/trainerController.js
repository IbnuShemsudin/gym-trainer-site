const Trainer = require('../models/Trainer');
const User = require('../models/User');

// Get all trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find()
            .populate('userId', 'name email phone')
            .populate('assignedMembers', 'firstName lastName email');
        res.json({ success: true, data: trainers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get trainer by ID
exports.getTrainerById = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id)
            .populate('userId')
            .populate('assignedMembers');
        if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
        res.json({ success: true, data: trainer });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Create new trainer
exports.createTrainer = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, phone, specializations, certifications, yearsOfExperience, bio, hourlyRate, availableDays, startTime, endTime } = req.body;

        // Verify user exists (should be a trainer user)
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const trainer = new Trainer({
            userId,
            firstName,
            lastName,
            email,
            phone,
            specializations: specializations || [],
            certifications: certifications || [],
            yearsOfExperience,
            bio,
            hourlyRate,
            availableDays: availableDays || [],
            startTime,
            endTime
        });

        await trainer.save();
        res.status(201).json({ success: true, message: 'Trainer created successfully', data: trainer });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Update trainer
exports.updateTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
        res.json({ success: true, message: 'Trainer updated successfully', data: trainer });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findByIdAndDelete(req.params.id);
        if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
        res.json({ success: true, message: 'Trainer deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get trainer's assigned members
exports.getTrainerMembers = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id).populate('assignedMembers');
        if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
        res.json({ success: true, data: trainer.assignedMembers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Assign member to trainer
exports.assignMember = async (req, res) => {
    try {
        const { trainerId, memberId } = req.body;
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

        if (!trainer.assignedMembers.includes(memberId)) {
            trainer.assignedMembers.push(memberId);
            await trainer.save();
        }

        res.json({ success: true, message: 'Member assigned successfully', data: trainer });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Remove member from trainer
exports.removeMember = async (req, res) => {
    try {
        const { trainerId, memberId } = req.body;
        const trainer = await Trainer.findByIdAndUpdate(
            trainerId,
            { $pull: { assignedMembers: memberId } },
            { new: true }
        );
        if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
        res.json({ success: true, message: 'Member removed successfully', data: trainer });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get active trainers
exports.getActiveTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find({ isActive: true });
        res.json({ success: true, data: trainers, count: trainers.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Search trainers by specialization
exports.getTrainersBySpecialization = async (req, res) => {
    try {
        const { specialization } = req.query;
        const trainers = await Trainer.find({ specializations: specialization, isActive: true });
        res.json({ success: true, data: trainers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
