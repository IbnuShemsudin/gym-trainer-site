const mongoose = require('mongoose');

const workoutExerciseSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true },
  sets: { type: Number },
  reps: { type: Number },
  weight: { type: Number },
  duration: { type: Number }, // in minutes
  restBetweenSets: { type: Number }, // in seconds
  notes: { type: String }
}, { _id: false });

const workoutPlanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  planType: { type: String, enum: ['strength', 'cardio', 'flexibility', 'mixed', 'weight_loss', 'muscle_gain'] },
  
  // Weekly schedule
  weeklySchedule: [
    {
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      exercises: [workoutExerciseSchema],
      focusArea: { type: String }
    }
  ],
  
  // Progress tracking
  progressNotes: [{ type: String }],
  completed: { type: Boolean, default: false },
  completionDate: { type: Date },
  
  // Status
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
