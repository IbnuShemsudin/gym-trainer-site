# Elite Gym Management System - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Clone & Install Dependencies

```bash
# Backend
cd api
npm install

# Frontend  
cd ../client
npm install
```

### 2. Environment Setup

Create `.env` file in the `api` directory:

```bash
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/elite-gym
JWT_SECRET=your-secret-key-here-change-in-production
ADMIN_SECRET_KEY=admin-secret-key
PORT=5000
```

Create `.env` file in `client` directory:

```bash
VITE_API_URL=http://localhost:5000
```

### 3. Start MongoDB (Local Development)

```bash
# Windows (if MongoDB installed)
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Run Backend

```bash
cd api
npm start
# Server runs on http://localhost:5000
```

### 5. Run Frontend (New Terminal)

```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

---

## 🔐 Default Admin Account

After first run, register an admin account:

1. Go to http://localhost:5173/register
2. Toggle to "Admin" mode
3. Enter admin secret: `admin-secret-key`
4. Click "Establish Credentials"

**Admin credentials will be:**
- Email: admin@gym.com
- Password: Your chosen password
- Role: Admin

---

## 📋 First Steps

### 1. Login
- Navigate to http://localhost:5173/login
- Use your admin credentials

### 2. Create Membership Plans
- Go to Dashboard → "System Configuration"
- Scroll to "Pricing Protocols"
- Create plans like:
  - Monthly Basic: 300 ETB (30 days)
  - Quarterly: 800 ETB (90 days)
  - Annual: 2500 ETB (365 days)

### 3. Add Trainers
- Go to "Trainers" tab
- Create trainer profiles with:
  - Name, email, phone
  - Specializations (cardio, strength, etc.)
  - Hourly rate

### 4. Register Members
- Go to "Prospects" or Members section
- Add member details:
  - Name, email, phone
  - DOB, height, weight, goals

### 5. Assign Memberships
- Go to Payments
- Record payment for member
- Select membership plan
- Member gets active status

### 6. Track Attendance
- Members can check in
- View attendance history
- Export reports

---

## 🎯 User Roles Quick Reference

### Admin
- Everything in the system
- Dashboard: http://localhost:5173/admin/dashboard

### Receptionist
- Member registration & updates
- Payment recording
- Attendance check-in
- NO access to: Analytics, trainer management

### Trainer
- View assigned members
- Create workout plans
- Track progress
- NO access to: Payments, system settings

### Member
- View own profile
- See membership status
- View assigned workouts
- Track attendance
- Receive notifications

---

## 🔧 Common Commands

```bash
# Backend
npm start              # Start server
npm run dev           # Development with auto-reload
npm test              # Run tests

# Frontend
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Check code quality

# Database
# MongoDB - Create indexes (run in MongoDB shell)
use elite-gym
db.users.createIndex({ email: 1 }, { unique: true })
db.members.createIndex({ membershipExpiryDate: 1 })
db.attendance.createIndex({ memberId: 1, checkInTime: -1 })
db.payments.createIndex({ paymentDate: -1 })
```

---

## 📊 API Testing

### Using Postman or cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gym.com",
    "password": "your-password"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "role": "admin",
  "name": "Admin User"
}
```

#### Get Members
```bash
curl -X GET http://localhost:5000/api/members \
  -H "x-auth-token: YOUR_TOKEN_HERE"
```

#### Record Payment
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN_HERE" \
  -d '{
    "memberId": "member_id_here",
    "membershipPlanId": "plan_id_here",
    "amount": 300,
    "paymentMethod": "cash"
  }'
```

#### Check In Member
```bash
curl -X POST http://localhost:5000/api/attendance/check-in \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN_HERE" \
  -d '{
    "memberId": "member_id_here",
    "checkInMethod": "manual"
  }'
```

---

## 🛠️ Troubleshooting

### Backend Won't Start

```bash
# Check if port 5000 is in use
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process using port
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### MongoDB Connection Error

```bash
# Check MongoDB is running
mongo --version

# Check connection string in .env
# Should be: mongodb://127.0.0.1:27017/elite-gym

# If using MongoDB Atlas:
# mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### Frontend Can't Connect to API

```bash
# Check VITE_API_URL in client/.env
# Should match backend PORT

# Clear browser cache and reload
# Check browser console for CORS errors
```

### Member Can't Register

```bash
# Check status is "pending" initially
# Admin must approve in Dashboard → Approvals
# After approval, member can log in
```

---

## 📱 API Response Examples

### Get Members List
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+251911234567",
      "membershipStatus": "active",
      "membershipExpiryDate": "2024-12-31T00:00:00.000Z",
      "height": 180,
      "weight": 75,
      "targetWeight": 70,
      "fitnessGoals": ["weight loss", "muscle gain"],
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Record Payment Response
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "_id": "60d5f0a1c1234567890abcdf",
    "memberId": "60d5ec49c1234567890abcde",
    "membershipPlanId": "60d5e1a1c1234567890abcd1",
    "amount": 300,
    "currency": "ETB",
    "paymentStatus": "completed",
    "paymentDate": "2024-06-14T10:30:00.000Z",
    "receiptNumber": "RCP-1718368200000-123",
    "transactionId": "TXN-1718368200000",
    "membershipStartDate": "2024-06-14T00:00:00.000Z",
    "membershipExpiryDate": "2024-07-14T00:00:00.000Z"
  }
}
```

### Attendance Check-In Response
```json
{
  "success": true,
  "message": "Check-in successful",
  "data": {
    "_id": "60d5f1b2c1234567890abce0",
    "memberId": "60d5ec49c1234567890abcde",
    "checkInTime": "2024-06-14T06:30:00.000Z",
    "checkInMethod": "manual",
    "status": "checked_in"
  }
}
```

---

## 📈 Features Implemented

✅ **User Management**
- Admin, Receptionist, Trainer, Member roles
- Registration approval workflow
- Profile management

✅ **Member Management**
- Add, edit, delete, search members
- Membership status tracking
- Trainer assignment

✅ **Membership Plans**
- Multiple plan types (monthly, quarterly, annual)
- Price management
- Features per plan

✅ **Payments**
- Payment recording
- Multiple payment methods
- Monthly revenue reports
- Receipt generation (ready for PDF export)

✅ **Attendance**
- Check-in/check-out system
- Daily attendance reports
- Member visit history
- QR code support (ready for implementation)

✅ **Trainers**
- Trainer profiles
- Member assignment
- Specialization tracking
- Performance ratings

✅ **Workout Plans**
- Create workout plans
- Weekly exercise schedules
- Progress tracking
- Plan completion

✅ **Notifications**
- Membership expiry alerts
- Payment reminders
- System announcements
- Auto-delete after 30 days

✅ **Dashboard**
- Admin analytics
- Revenue charts
- Member statistics
- Quick actions

---

## 🚀 Next Steps

1. **Customize Branding**
   - Update colors in Tailwind config
   - Add gym logo

2. **Add Report Generation**
   - Install: `npm install jspdf html2canvas`
   - Create PDF reports for payments/attendance

3. **QR Code Integration**
   - Install: `npm install qrcode.react`
   - Implement QR attendance system

4. **Real-time Notifications**
   - Install: `npm install socket.io socket.io-client`
   - Setup WebSocket for live updates

5. **Mobile App**
   - Use React Native with same API
   - Member check-in from phone

6. **Payment Integration**
   - Stripe or Chapa payment gateway
   - Online payment processing

---

## 📞 Support

For issues:
1. Check logs in `api` and `client` console
2. Review MongoDB connection
3. Check `.env` configuration
4. Verify all ports are available
5. Clear browser cache

---

## 📄 Documentation Files

- **ARCHITECTURE.md** - Complete system design
- **GYM_SYSTEM_FRONTEND_GUIDE.md** - Frontend implementation
- **API Endpoints** - All REST endpoints listed

---

**Ready to Go!** 🎉

Your gym management system is fully set up and ready to use. Start by creating membership plans, adding trainers, and registering members.

Good luck! 💪
