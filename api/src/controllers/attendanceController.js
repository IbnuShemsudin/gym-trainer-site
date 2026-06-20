const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

// Check in member
exports.checkIn = async (req, res) => {
    try {
        const { memberId, checkInMethod, qrCodeData, notes } = req.body;

        // Verify member exists
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

        // Check if member is active
        if (!member.isActive || member.membershipStatus !== 'active') {
            return res.status(403).json({ success: false, message: 'Member is not active or membership expired' });
        }

        const attendance = new Attendance({
            memberId,
            checkInTime: new Date(),
            checkInMethod: checkInMethod || 'manual',
            qrCodeData,
            notes,
            recordedBy: req.user?.id,
            status: 'checked_in'
        });

        await attendance.save();
        res.status(201).json({ success: true, message: 'Check-in successful', data: attendance });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Check out member
exports.checkOut = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const attendance = await Attendance.findById(attendanceId);

        if (!attendance) return res.status(404).json({ success: false, message: 'Attendance record not found' });

        const checkOutTime = new Date();
        const duration = Math.round((checkOutTime - attendance.checkInTime) / 60000); // in minutes

        attendance.checkOutTime = checkOutTime;
        attendance.duration = duration;
        attendance.status = 'checked_out';

        await attendance.save();
        res.json({ success: true, message: 'Check-out successful', data: attendance });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get attendance by member
exports.getAttendanceByMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { startDate, endDate } = req.query;

        const query = { memberId };

        if (startDate && endDate) {
            query.checkInTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const attendance = await Attendance.find(query)
            .populate('memberId', 'firstName lastName email')
            .sort({ checkInTime: -1 });

        res.json({ success: true, data: attendance, count: attendance.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get today's attendance
exports.getTodayAttendance = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.find({
            checkInTime: { $gte: startOfDay, $lte: endOfDay }
        }).populate('memberId', 'firstName lastName email');

        res.json({ success: true, data: attendance, count: attendance.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get attendance report
exports.getAttendanceReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {};
        if (startDate && endDate) {
            query.checkInTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const attendance = await Attendance.find(query)
            .populate('memberId', 'firstName lastName email')
            .sort({ checkInTime: -1 });

        // Group by member
        const memberAttendance = {};
        attendance.forEach(record => {
            const memberId = record.memberId._id;
            if (!memberAttendance[memberId]) {
                memberAttendance[memberId] = {
                    member: record.memberId,
                    visits: 0,
                    totalDuration: 0
                };
            }
            memberAttendance[memberId].visits++;
            memberAttendance[memberId].totalDuration += record.duration || 0;
        });

        res.json({ success: true, data: Object.values(memberAttendance), count: attendance.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get all attendance
exports.getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('memberId', 'firstName lastName email')
            .sort({ checkInTime: -1 });

        res.json({ success: true, data: attendance });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.params.id);
        if (!attendance) return res.status(404).json({ success: false, message: 'Attendance record not found' });
        res.json({ success: true, message: 'Record deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
