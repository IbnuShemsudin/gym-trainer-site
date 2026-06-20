const Notification = require('../models/Notification');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId })
            .populate('relatedMemberId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await Notification.countDocuments({ userId, isRead: false });
        res.json({ success: true, count });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true, readAt: new Date() },
            { new: true }
        );
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.json({ success: true, data: notification });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.params;
        await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Create notification
exports.createNotification = async (req, res) => {
    try {
        const { userId, title, message, type, relatedMemberId, priority } = req.body;

        const notification = new Notification({
            userId,
            title,
            message,
            type: type || 'system',
            relatedMemberId,
            priority: priority || 'medium'
        });

        await notification.save();
        res.status(201).json({ success: true, message: 'Notification created', data: notification });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.json({ success: true, message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Send membership expiry notifications
exports.sendExpiryReminders = async (req, res) => {
    try {
        const Member = require('../models/Member');
        const User = require('../models/User');

        // Find members with expiring membership (7 days from now)
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

        const expiringMembers = await Member.find({
            membershipExpiryDate: {
                $gte: new Date(),
                $lte: sevenDaysLater
            },
            membershipStatus: 'active'
        }).populate('userId');

        const notifications = [];

        for (const member of expiringMembers) {
            // Create notification for admin
            const admins = await User.find({ role: 'admin' });
            for (const admin of admins) {
                const notification = new Notification({
                    userId: admin._id,
                    title: 'Membership Expiring Soon',
                    message: `${member.firstName} ${member.lastName}'s membership expires on ${member.membershipExpiryDate.toLocaleDateString()}`,
                    type: 'membership_expiry',
                    relatedMemberId: member._id,
                    priority: 'high'
                });
                await notification.save();
                notifications.push(notification);
            }
        }

        res.json({ success: true, message: `${notifications.length} reminder notifications sent`, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Send payment reminders
exports.sendPaymentReminders = async (req, res) => {
    try {
        const Payment = require('../models/Payment');
        const User = require('../models/User');

        // Find pending payments
        const pendingPayments = await Payment.find({ paymentStatus: 'pending' })
            .populate('memberId')
            .populate('recordedBy');

        const notifications = [];

        for (const payment of pendingPayments) {
            const receptionists = await User.find({ role: 'receptionist' });
            for (const receptionist of receptionists) {
                const notification = new Notification({
                    userId: receptionist._id,
                    title: 'Payment Pending',
                    message: `Payment from ${payment.memberId.firstName} ${payment.memberId.lastName} is pending. Amount: ${payment.amount}`,
                    type: 'payment_reminder',
                    relatedPaymentId: payment._id,
                    priority: 'medium'
                });
                await notification.save();
                notifications.push(notification);
            }
        }

        res.json({ success: true, message: `${notifications.length} payment reminder notifications sent`, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
