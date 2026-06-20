const WorkoutPlan = require('../models/WorkoutPlan');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

// Create workout plan
exports.createWorkoutPlan = async (req, res) => {
    try {
        const { memberId, trainerId, title, description, startDate, endDate, planType, weeklySchedule } = req.body;

        // Verify member and trainer exist
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

        const trainer = await Trainer.findById(trainerId);
        if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

        const plan = new WorkoutPlan({
            memberId,
            trainerId,
            title,
            description,
            startDate,
            endDate,
            planType,
            weeklySchedule: weeklySchedule || []
        });

        await plan.save();
        res.status(201).json({ success: true, message: 'Workout plan created successfully', data: plan });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get all workout plans
exports.getAllWorkoutPlans = async (req, res) => {
    try {
        const plans = await WorkoutPlan.find()
            .populate('memberId', 'firstName lastName email')
            .populate('trainerId', 'firstName lastName');
        res.json({ success: true, data: plans });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get workout plan by ID
exports.getWorkoutPlanById = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findById(req.params.id)
            .populate('memberId')
            .populate('trainerId');
        if (!plan) return res.status(404).json({ success: false, message: 'Workout plan not found' });
        res.json({ success: true, data: plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get workout plans by member
exports.getWorkoutPlansByMember = async (req, res) => {
    try {
        const plans = await WorkoutPlan.find({ memberId: req.params.memberId, isActive: true })
            .populate('trainerId', 'firstName lastName');
        res.json({ success: true, data: plans });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get workout plans by trainer
exports.getWorkoutPlansByTrainer = async (req, res) => {
    try {
        const plans = await WorkoutPlan.find({ trainerId: req.params.trainerId, isActive: true })
            .populate('memberId', 'firstName lastName email');
        res.json({ success: true, data: plans });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update workout plan
exports.updateWorkoutPlan = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!plan) return res.status(404).json({ success: false, message: 'Workout plan not found' });
        res.json({ success: true, message: 'Workout plan updated successfully', data: plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add exercise to workout plan
exports.addExercise = async (req, res) => {
    try {
        const { day, exercise } = req.body;
        const plan = await WorkoutPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Workout plan not found' });

        // Find the day schedule
        const daySchedule = plan.weeklySchedule.find(s => s.day === day);
        if (daySchedule) {
            daySchedule.exercises.push(exercise);
        } else {
            plan.weeklySchedule.push({
                day,
                exercises: [exercise],
                focusArea: exercise.focusArea || ''
            });
        }

        await plan.save();
        res.json({ success: true, message: 'Exercise added successfully', data: plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Complete workout plan
exports.completeWorkoutPlan = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findByIdAndUpdate(
            req.params.id,
            { completed: true, completionDate: new Date(), isActive: false },
            { new: true }
        );
        if (!plan) return res.status(404).json({ success: false, message: 'Workout plan not found' });
        res.json({ success: true, message: 'Workout plan marked as completed', data: plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete workout plan
exports.deleteWorkoutPlan = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findByIdAndDelete(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Workout plan not found' });
        res.json({ success: true, message: 'Workout plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add progress note
exports.addProgressNote = async (req, res) => {
    try {
        const { note } = req.body;
        const plan = await WorkoutPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Workout plan not found' });

        plan.progressNotes.push(note);
        await plan.save();
        res.json({ success: true, message: 'Progress note added successfully', data: plan });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
