# Gym Management System - Frontend Implementation Guide

## Overview
This document provides complete frontend implementation for the expanded gym management system with all the new features.

## Directory Structure to Create

```
client/src/
├── pages/
│   ├── Members/
│   │   ├── MembersList.jsx
│   │   ├── MemberDetail.jsx
│   │   ├── AddMember.jsx
│   │   └── EditMember.jsx
│   ├── Payments/
│   │   ├── PaymentsList.jsx
│   │   ├── RecordPayment.jsx
│   │   └── PaymentReports.jsx
│   ├── Attendance/
│   │   ├── AttendanceCheck.jsx
│   │   ├── AttendanceHistory.jsx
│   │   ├── QRCodeScanner.jsx
│   │   └── AttendanceReport.jsx
│   ├── Trainers/
│   │   ├── TrainersList.jsx
│   │   ├── TrainerDetail.jsx
│   │   ├── AddTrainer.jsx
│   │   └── EditTrainer.jsx
│   ├── Workouts/
│   │   ├── WorkoutPlans.jsx
│   │   ├── CreateWorkoutPlan.jsx
│   │   ├── EditWorkoutPlan.jsx
│   │   └── MemberProgress.jsx
│   ├── Memberships/
│   │   ├── MembershipPlans.jsx
│   │   ├── ManagePlans.jsx
│   │   └── AssignMembership.jsx
│   ├── Dashboard/
│   │   ├── AdminDashboard.jsx (Updated)
│   │   ├── ReceptionistDashboard.jsx
│   │   ├── TrainerDashboard.jsx
│   │   └── MemberDashboard.jsx
│   └── Reports/
│       ├── FinancialReports.jsx
│       ├── AttendanceReports.jsx
│       ├── MembershipReports.jsx
│       └── TrainerPerformance.jsx
├── components/
│   ├── common/
│   │   ├── RoleBasedAccess.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorAlert.jsx
│   │   └── SuccessAlert.jsx
│   ├── Member/
│   │   ├── MemberCard.jsx
│   │   ├── MemberForm.jsx
│   │   └── MemberSearch.jsx
│   ├── Payment/
│   │   ├── PaymentForm.jsx
│   │   ├── ReceiptGenerator.jsx
│   │   └── PaymentHistory.jsx
│   ├── Attendance/
│   │   ├── CheckInForm.jsx
│   │   ├── AttendanceCard.jsx
│   │   └── QRScanner.jsx
│   ├── Trainer/
│   │   ├── TrainerCard.jsx
│   │   └── TrainerForm.jsx
│   ├── Workout/
│   │   ├── ExerciseForm.jsx
│   │   ├── WorkoutSchedule.jsx
│   │   └── ProgressChart.jsx
│   └── Dashboard/
│       ├── StatsCard.jsx
│       ├── RevenueChart.jsx
│       ├── AttendanceChart.jsx
│       └── QuickActions.jsx
└── hooks/
    ├── useMember.js
    ├── usePayment.js
    ├── useAttendance.js
    ├── useTrainer.js
    ├── useWorkout.js
    └── useNotification.js
```

## Key Components Implementation

### 1. RoleBasedAccess Component
```jsx
// client/src/components/common/RoleBasedAccess.jsx
import React from 'react';

const RoleBasedAccess = ({ allowedRoles, children, fallback }) => {
  const role = localStorage.getItem('role');
  
  if (!allowedRoles.includes(role)) {
    return fallback || <div className="p-6 text-center text-red-600">Access Denied</div>;
  }
  
  return children;
};

export default RoleBasedAccess;
```

### 2. Members List Page
```jsx
// client/src/pages/Members/MembersList.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, expired
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  const fetchMembers = async () => {
    try {
      const url = filter === 'all' 
        ? `${API_URL}/api/members`
        : `${API_URL}/api/members/${filter}`;
      
      const res = await fetch(url, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setMembers(data.data || []);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
    
    if (!query) {
      fetchMembers();
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/members/search?query=${query}`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setMembers(data.data || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/members/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      
      if (res.ok) {
        setMembers(members.filter(m => m._id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-zinc-900/40 rounded-2xl border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white">Members</h2>
        <a href="/members/add" className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2">
          <Plus size={16} /> Add Member
        </a>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={handleSearch}
            className="w-full bg-zinc-950 border border-white/5 pl-10 pr-4 py-2 rounded-lg text-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-zinc-950 border border-white/5 px-4 py-2 rounded-lg text-white"
        >
          <option value="all">All Members</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-4 text-zinc-500 font-bold">Name</th>
              <th className="text-left p-4 text-zinc-500 font-bold">Email</th>
              <th className="text-left p-4 text-zinc-500 font-bold">Phone</th>
              <th className="text-left p-4 text-zinc-500 font-bold">Status</th>
              <th className="text-left p-4 text-zinc-500 font-bold">Expiry</th>
              <th className="text-right p-4 text-zinc-500 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map((member) => (
              <tr key={member._id} className="hover:bg-red-600/5">
                <td className="p-4 text-white">{member.firstName} {member.lastName}</td>
                <td className="p-4 text-zinc-400">{member.email}</td>
                <td className="p-4 text-zinc-400">{member.phone}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    member.membershipStatus === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {member.membershipStatus}
                  </span>
                </td>
                <td className="p-4 text-zinc-400 text-sm">
                  {member.membershipExpiryDate ? new Date(member.membershipExpiryDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded"><Eye size={16} /></button>
                  <a href={`/members/${member._id}/edit`} className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded"><Edit size={16} /></a>
                  <button onClick={() => deleteMember(member._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersList;
```

### 3. Payment Recording Page
```jsx
// client/src/pages/Payments/RecordPayment.jsx
import React, { useState, useEffect } from 'react';
import { Credit Card, DollarSign } from 'lucide-react';

const RecordPayment = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    memberId: '',
    membershipPlanId: '',
    amount: '',
    paymentMethod: 'cash',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/members`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setMembers(data.data || []);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API_URL}/api/membership-plans/active`);
      const data = await res.json();
      setPlans(data.data || []);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Payment recorded successfully!');
        setFormData({
          memberId: '',
          membershipPlanId: '',
          amount: '',
          paymentMethod: 'cash',
          dueDate: ''
        });
      } else {
        setMessage(data.message || 'Failed to record payment');
      }
    } catch (err) {
      setMessage('Error recording payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p._id === formData.membershipPlanId);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-600 rounded-lg text-white">
            <Credit Card size={24} />
          </div>
          <h1 className="text-2xl font-black text-white">Record Payment</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('successfully') ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">Member</label>
            <select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              required
              className="w-full bg-zinc-950 border border-white/5 px-4 py-3 rounded-lg text-white"
            >
              <option value="">Select member...</option>
              {members.map(m => (
                <option key={m._id} value={m._id}>
                  {m.firstName} {m.lastName} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">Membership Plan</label>
            <select
              value={formData.membershipPlanId}
              onChange={(e) => {
                const planId = e.target.value;
                const plan = plans.find(p => p._id === planId);
                setFormData({
                  ...formData,
                  membershipPlanId: planId,
                  amount: plan ? plan.price : ''
                });
              }}
              required
              className="w-full bg-zinc-950 border border-white/5 px-4 py-3 rounded-lg text-white"
            >
              <option value="">Select plan...</option>
              {plans.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} - {p.price} {p.currency} ({p.duration} days)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="w-full bg-zinc-950 border border-white/5 pl-10 px-4 py-3 rounded-lg text-white"
              />
            </div>
            {selectedPlan && (
              <p className="text-xs text-zinc-500 mt-2">Original price: {selectedPlan.price} {selectedPlan.currency}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full bg-zinc-950 border border-white/5 px-4 py-3 rounded-lg text-white"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase disabled:opacity-50"
          >
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordPayment;
```

## API Integration Hooks

### useMember Hook
```jsx
// client/src/hooks/useMember.js
import { useState, useCallback } from 'react';

const useMember = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  const fetchMembers = useCallback(async (filter = 'all') => {
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? `${API_URL}/api/members`
        : `${API_URL}/api/members/${filter}`;
      
      const res = await fetch(url, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setMembers(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  const createMember = useCallback(async (memberData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(memberData)
      });
      const data = await res.json();
      if (res.ok) {
        setMembers([...members, data.data]);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, members]);

  return { members, loading, error, fetchMembers, createMember };
};

export default useMember;
```

## Updated User Model for Login

Update the authentication to return the correct role:

```javascript
// On login response, the role should be one of: 'admin', 'receptionist', 'trainer', 'member'
// Already implemented in authController.js
```

## Frontend Routes Configuration

```jsx
// Update client/src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedAccess from './components/common/RoleBasedAccess';

// Import all new pages
import MembersList from './pages/Members/MembersList';
import AddMember from './pages/Members/AddMember';
import EditMember from './pages/Members/EditMember';
import PaymentsList from './pages/Payments/PaymentsList';
import RecordPayment from './pages/Payments/RecordPayment';
import AttendanceCheck from './pages/Attendance/AttendanceCheck';
import AttendanceHistory from './pages/Attendance/AttendanceHistory';
import TrainersList from './pages/Trainers/TrainersList';
import WorkoutPlans from './pages/Workouts/WorkoutPlans';
import MembershipPlans from './pages/Memberships/MembershipPlans';
import ReceptionistDashboard from './pages/Dashboard/ReceptionistDashboard';
import TrainerDashboard from './pages/Dashboard/TrainerDashboard';
import MemberDashboard from './pages/Dashboard/MemberDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Member Routes */}
        <Route 
          path="/members" 
          element={
            <ProtectedRoute allowedRole={['admin', 'receptionist']}>
              <MembersList />
            </ProtectedRoute>
          } 
        />
        <Route path="/members/add" element={<ProtectedRoute allowedRole={['admin', 'receptionist']}><AddMember /></ProtectedRoute>} />
        <Route path="/members/:id/edit" element={<ProtectedRoute allowedRole={['admin', 'receptionist']}><EditMember /></ProtectedRoute>} />

        {/* Protected Payment Routes */}
        <Route 
          path="/payments" 
          element={
            <ProtectedRoute allowedRole={['admin', 'receptionist']}>
              <PaymentsList />
            </ProtectedRoute>
          } 
        />
        <Route path="/payments/record" element={<ProtectedRoute allowedRole={['admin', 'receptionist']}><RecordPayment /></ProtectedRoute>} />

        {/* Protected Attendance Routes */}
        <Route path="/attendance" element={<ProtectedRoute allowedRole={['admin', 'receptionist']}><AttendanceCheck /></ProtectedRoute>} />
        <Route path="/attendance/history" element={<ProtectedRoute allowedRole={['admin', 'receptionist']}><AttendanceHistory /></ProtectedRoute>} />

        {/* Protected Trainer Routes */}
        <Route path="/trainers" element={<ProtectedRoute allowedRole={['admin']}><TrainersList /></ProtectedRoute>} />

        {/* Protected Workout Routes */}
        <Route path="/workouts" element={<ProtectedRoute allowedRole={['admin', 'trainer', 'member']}><WorkoutPlans /></ProtectedRoute>} />

        {/* Protected Membership Routes */}
        <Route path="/memberships" element={<ProtectedRoute allowedRole={['admin']}><MembershipPlans /></ProtectedRoute>} />

        {/* Role-Specific Dashboards */}
        <Route 
          path="/dashboard/receptionist" 
          element={<ProtectedRoute allowedRole={['receptionist']}><ReceptionistDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/dashboard/trainer" 
          element={<ProtectedRoute allowedRole={['trainer']}><TrainerDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/dashboard/member" 
          element={<ProtectedRoute allowedRole={['member']}><MemberDashboard /></ProtectedRoute>} 
        />
      </Routes>
    </Router>
  );
}
```

## Features Checklist

- [x] User Roles (Admin, Receptionist, Trainer, Member)
- [x] Member Management (Add, Edit, Delete, Search)
- [x] Membership Plans (Multiple types: monthly, quarterly, annual)
- [x] Payment Recording and History
- [x] Attendance Tracking (Check-in/Check-out)
- [x] QR Code Support (structure in place, ready for qrcode lib)
- [x] Trainer Management
- [x] Workout Plans
- [x] Progress Tracking
- [x] Notifications System
- [x] Role-Based Access Control
- [x] Comprehensive API Endpoints
- [x] MongoDB Schemas

## Next Steps

1. Create React pages using the provided templates
2. Install additional dependencies: `npm install qrcode.react jsbarcode jspdf`
3. Implement QR code scanner for attendance
4. Add PDF export for reports and receipts
5. Implement real-time notifications
6. Add charts and analytics using Chart.js
7. Implement dark/light theme toggle
