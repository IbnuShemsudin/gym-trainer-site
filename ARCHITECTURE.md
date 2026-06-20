# Elite Gym Management System - Complete Architecture

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Database Design](#database-design)
3. [API Architecture](#api-architecture)
4. [Authentication & Security](#authentication--security)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Deployment Guide](#deployment-guide)

---

## System Overview

### Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Additional**: Socket.io for real-time notifications

### Architecture Pattern
- REST API with role-based access control
- Clean separation of concerns (Models, Controllers, Middleware, Routes)
- Scalable folder structure for easy expansion

---

## Database Design

### Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                          │
└─────────────────────────────────────────────────────────────────┘

Users (Auth)
├── id (PK)
├── name
├── email (UNIQUE)
├── password (hashed)
├── phone
├── role (enum: admin, receptionist, trainer, member)
├── status (enum: pending, approved, rejected)
├── profilePhoto
├── address
├── dateOfBirth
├── gender
├── emergencyContact
├── emergencyPhone
├── createdAt
└── updatedAt

├── References:
│   └── User -> Member (One-to-One)
│   └── User -> Trainer (One-to-One)

Member
├── id (PK)
├── userId (FK -> User)
├── firstName
├── lastName
├── email
├── phone
├── dateOfBirth
├── gender
├── address, city, state, zipCode
├── profilePhoto
├── emergencyContact
├── emergencyPhone
├── currentMembershipId (FK -> MembershipPlan)
├── membershipStartDate
├── membershipExpiryDate
├── membershipStatus (enum: active, expired, suspended, inactive)
├── assignedTrainerId (FK -> Trainer)
├── height (cm)
├── weight (kg)
├── targetWeight (kg)
├── fitnessGoals (array)
├── isActive (boolean)
├── createdAt
└── updatedAt

├── Relationships:
│   ├── One Member -> One Trainer (assignedTrainerId)
│   ├── One Member -> Many Payments
│   ├── One Member -> Many Attendance Records
│   ├── One Member -> Many Workout Plans
│   └── One Member -> One Membership Plan (current)

MembershipPlan
├── id (PK)
├── name (e.g., 'Monthly Basic')
├── duration (in days)
├── price
├── currency (e.g., 'ETB')
├── description
├── features (array)
├── maxTrainingSessions
├── discountPercentage
├── planType (enum: monthly, quarterly, annual, custom)
├── isActive (boolean)
├── createdAt
└── updatedAt

├── Relationships:
│   ├── One Plan -> Many Members
│   └── One Plan -> Many Payments

Payment
├── id (PK)
├── memberId (FK -> Member) [REQUIRED]
├── membershipPlanId (FK -> MembershipPlan)
├── amount
├── currency (e.g., 'ETB')
├── paymentMethod (enum: cash, card, bank_transfer, cheque, other)
├── paymentStatus (enum: pending, completed, failed, refunded)
├── transactionId (UNIQUE)
├── paymentDate
├── dueDate
├── membershipStartDate
├── membershipExpiryDate
├── notes
├── receiptNumber (UNIQUE)
├── recordedBy (FK -> User)
├── createdAt
└── updatedAt

├── Relationships:
│   ├── Many Payments -> One Member
│   └── Many Payments -> One MembershipPlan

Attendance
├── id (PK)
├── memberId (FK -> Member) [REQUIRED]
├── checkInTime (datetime)
├── checkOutTime (datetime)
├── duration (in minutes)
├── checkInMethod (enum: qr_code, rfid, manual, app)
├── qrCodeData
├── notes
├── recordedBy (FK -> User)
├── status (enum: checked_in, checked_out, no_show)
├── createdAt
└── Indexes: [memberId, checkInTime]

├── Relationships:
│   └── Many Attendance -> One Member

Trainer
├── id (PK)
├── userId (FK -> User) [REQUIRED]
├── firstName
├── lastName
├── email
├── phone
├── profilePhoto
├── specializations (array)
├── certifications (array)
├── yearsOfExperience
├── bio
├── hourlyRate
├── availableDays (array)
├── startTime
├── endTime
├── assignedMembers (array of Member IDs)
├── rating (0-5)
├── reviews (array)
├── isActive (boolean)
├── createdAt
└── updatedAt

├── Relationships:
│   ├── One Trainer -> One User
│   ├── One Trainer -> Many Members
│   └── One Trainer -> Many Workout Plans

WorkoutPlan
├── id (PK)
├── memberId (FK -> Member) [REQUIRED]
├── trainerId (FK -> Trainer) [REQUIRED]
├── title
├── description
├── startDate
├── endDate
├── planType (enum: strength, cardio, flexibility, mixed, weight_loss, muscle_gain)
├── weeklySchedule (embedded array):
│   ├── day (enum: Monday-Sunday)
│   ├── exercises (embedded array):
│   │   ├── exerciseName
│   │   ├── sets
│   │   ├── reps
│   │   ├── weight
│   │   ├── duration
│   │   ├── restBetweenSets
│   │   └── notes
│   └── focusArea
├── progressNotes (array)
├── completed (boolean)
├── completionDate
├── isActive (boolean)
├── createdAt
└── updatedAt

├── Relationships:
│   ├── Many Workout Plans -> One Member
│   └── Many Workout Plans -> One Trainer

Notification
├── id (PK)
├── userId (FK -> User) [REQUIRED]
├── title
├── message
├── type (enum: membership_expiry, payment_reminder, announcement, appointment, progress_update, system)
├── relatedMemberId (FK -> Member)
├── relatedWorkoutPlanId (FK -> WorkoutPlan)
├── relatedPaymentId (FK -> Payment)
├── isRead (boolean)
├── readAt (datetime)
├── priority (enum: low, medium, high)
├── createdAt
├── expiresAt (30 days TTL)
└── Indexes: [userId, isRead], TTL on expiresAt

└── Relationships:
    └── Many Notifications -> One User
```

### MongoDB Schema Index Optimization

```javascript
// Recommended Indexes

Users:
- { email: 1 } - UNIQUE
- { role: 1, status: 1 }
- { createdAt: -1 }

Member:
- { userId: 1 } - UNIQUE
- { membershipExpiryDate: 1 }
- { membershipStatus: 1 }
- { email: 1 }

Attendance:
- { memberId: 1, checkInTime: -1 }
- { checkInTime: -1 }

Payment:
- { memberId: 1, paymentDate: -1 }
- { paymentStatus: 1 }
- { createdAt: -1 }

Notification:
- { userId: 1, isRead: 1 }
- { userId: 1, createdAt: -1 }
```

---

## API Architecture

### API Endpoint Structure

```
BASE_URL: http://localhost:5000/api

AUTH ROUTES (Public)
├── POST   /auth/register               - Register new user
├── POST   /auth/login                  - Login user
├── PUT    /auth/profile                - Update own profile
└── PUT    /admin/update-profile        - Update admin profile (admin only)

REGISTRATION APPROVAL (Admin)
├── GET    /admin/requests              - Get pending registrations
├── PUT    /admin/requests/:id/approve  - Approve registration
└── PUT    /admin/requests/:id/reject   - Reject registration

MEMBER MANAGEMENT (Admin, Receptionist)
├── GET    /members                     - Get all members
├── GET    /members/:id                 - Get member details
├── GET    /members/search              - Search members
├── GET    /members/active              - Get active members
├── GET    /members/expired             - Get expired members
├── POST   /members                     - Create member
├── PUT    /members/:id                 - Update member
├── DELETE /members/:id                 - Delete member
└── POST   /members/:id/assign-trainer  - Assign trainer

MEMBERSHIP PLANS (Admin, Public)
├── GET    /membership-plans            - Get all plans
├── GET    /membership-plans/active     - Get active plans
├── GET    /membership-plans/:id        - Get plan details
├── GET    /membership-plans/type/:type - Get plans by type
├── POST   /membership-plans            - Create plan (admin)
├── PUT    /membership-plans/:id        - Update plan (admin)
├── DELETE /membership-plans/:id        - Delete plan (admin)
├── PUT    /membership-plans/:id/activate   - Activate plan (admin)
└── PUT    /membership-plans/:id/deactivate - Deactivate plan (admin)

PAYMENT MANAGEMENT (Admin, Receptionist)
├── GET    /payments                    - Get all payments
├── GET    /payments/:id                - Get payment details
├── GET    /payments/member/:memberId   - Get member payments
├── GET    /payments/report             - Get payment report
├── GET    /payments/revenue/monthly    - Get monthly revenue
├── POST   /payments                    - Record payment
└── PUT    /payments/:id                - Update payment

ATTENDANCE TRACKING (Admin, Receptionist, Member)
├── GET    /attendance                  - Get all attendance
├── GET    /attendance/today            - Get today's attendance
├── GET    /attendance/:memberId        - Get member attendance
├── GET    /attendance/report           - Get attendance report
├── POST   /attendance/check-in         - Check in member
├── PUT    /attendance/:id/check-out    - Check out member
└── DELETE /attendance/:id              - Delete record

TRAINER MANAGEMENT (Admin)
├── GET    /trainers                    - Get all trainers
├── GET    /trainers/:id                - Get trainer details
├── GET    /trainers/active             - Get active trainers
├── GET    /trainers/specialization     - Get by specialization
├── GET    /trainers/:id/members        - Get trainer's members
├── POST   /trainers                    - Create trainer
├── PUT    /trainers/:id                - Update trainer
├── DELETE /trainers/:id                - Delete trainer
├── POST   /trainers/assign-member      - Assign member
└── POST   /trainers/remove-member      - Remove member

WORKOUT PLANS (Admin, Trainer, Member)
├── GET    /workout-plans               - Get all plans
├── GET    /workout-plans/:id           - Get plan details
├── GET    /workout-plans/member/:id    - Get member's plans
├── GET    /workout-plans/trainer/:id   - Get trainer's plans
├── POST   /workout-plans               - Create plan
├── PUT    /workout-plans/:id           - Update plan
├── POST   /workout-plans/:id/add-exercise      - Add exercise
├── POST   /workout-plans/:id/progress         - Add progress note
├── POST   /workout-plans/:id/complete        - Complete plan
└── DELETE /workout-plans/:id           - Delete plan

NOTIFICATIONS (All authenticated users)
├── GET    /notifications/user/:id      - Get user notifications
├── GET    /notifications/user/:id/unread - Get unread count
├── POST   /notifications               - Create notification (admin)
├── PUT    /notifications/:id/read      - Mark as read
├── PUT    /notifications/user/:id/read-all - Mark all as read
├── POST   /notifications/send-expiry-reminders   - Send reminders
├── POST   /notifications/send-payment-reminders  - Send reminders
└── DELETE /notifications/:id           - Delete notification

LEGACY ROUTES (Keep for compatibility)
├── GET    /leads
├── POST   /leads
├── DELETE /leads/:id
├── GET    /gallery
├── POST   /gallery
├── DELETE /gallery/:id
├── GET    /pricing
├── POST   /pricing
└── DELETE /pricing/:id
```

### Response Format

All API responses follow this standard format:

```json
{
  "success": true/false,
  "message": "Human readable message",
  "data": {},
  "error": "Error details if present"
}
```

### HTTP Status Codes

- `200 OK` - Successful GET
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Server Error` - Server error

---

## Authentication & Security

### JWT Token Structure

```javascript
{
  "id": "user_mongodb_id",
  "role": "admin|receptionist|trainer|member",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Password Requirements

- Minimum 8 characters
- Hash using bcryptjs with salt rounds 10+
- Never store plain text passwords

### Security Headers (Recommended)

```javascript
// Add to middleware
app.use(helmet()); // security headers
app.use(cors()); // CORS configuration
app.use(mongoSanitize()); // data sanitization
app.use(rateLimit()); // rate limiting
```

### Protected Routes Pattern

```javascript
// Require authentication
app.get('/api/protected', auth, (req, res) => {
  // req.user available here
});

// Require specific role
app.post('/api/admin-only', auth, roleAuth(['admin']), (req, res) => {
  // Only admins can access
});

// Multiple roles allowed
app.get('/api/staff', auth, roleAuth(['admin', 'receptionist']), (req, res) => {
  // Both roles can access
});
```

---

## User Roles & Permissions

### Role Hierarchy

```
ADMIN (Full Access)
├── Can manage all users and roles
├── Can manage memberships and payments
├── Can view all reports
├── Can manage system settings
├── Can send bulk notifications
└── Full financial reports access

RECEPTIONIST (Limited Staff)
├── Can register new members
├── Can update member information
├── Can record payments
├── Can check membership status
├── Can record attendance
├── Can view member's own records
└── Cannot delete data (soft delete only)

TRAINER (Professional)
├── Can view assigned members
├── Can create workout plans
├── Can track member progress
├── Can manage training schedules
├── Can update workout plans
└── Can view member profiles

MEMBER (User)
├── Can view own profile
├── Can view membership details
├── Can view assigned workout plans
├── Can track own attendance history
├── Can receive notifications
└── Cannot modify any data except profile
```

### Permission Matrix

| Feature | Admin | Receptionist | Trainer | Member |
|---------|-------|--------------|---------|--------|
| Member Management | ✅ | ✅ | ❌ | ❌ |
| Membership Plans | ✅ | ❌ | ❌ | ✅ |
| Payments | ✅ | ✅ | ❌ | ❌ |
| Attendance | ✅ | ✅ | ❌ | ✅ |
| Trainers | ✅ | ❌ | ✅ | ❌ |
| Workouts | ✅ | ❌ | ✅ | ✅ |
| Notifications | ✅ | ❌ | ❌ | ✅ |
| Reports | ✅ | ❌ | ❌ | ❌ |

---

## Deployment Guide

### Prerequisites

- Node.js v16+
- MongoDB 4.4+
- npm or yarn
- Git

### Environment Variables

```bash
# .env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/gym-db
JWT_SECRET=your-super-secret-key-change-this
ADMIN_SECRET_KEY=admin-registration-key
PORT=5000

# Optional
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Elite Gym
```

### Installation Steps

```bash
# Backend Setup
cd gym-trainer-site/api
npm install
npm run build # if needed
npm start

# Frontend Setup
cd gym-trainer-site/client
npm install
npm run build
npm run preview # or serve the dist folder
```

### Docker Deployment (Recommended)

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile
# Dockerfile for frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### MongoDB Atlas Setup

1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist IP address
4. Get connection string
5. Update `MONGO_URI` in `.env`

### Deployment Platforms

#### Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

#### Render/Railway (Backend)
- Connect GitHub repository
- Set environment variables
- Deploy automatically

#### AWS/DigitalOcean
- Use Docker containers
- Set up load balancer
- Configure SSL/TLS
- Set up CI/CD pipeline

---

## Performance Optimization

### Database Optimization

```javascript
// Add these indexes to MongoDB
db.users.createIndex({ email: 1 }, { unique: true });
db.members.createIndex({ membershipExpiryDate: 1 });
db.attendance.createIndex({ memberId: 1, checkInTime: -1 });
db.payments.createIndex({ paymentDate: -1 });
```

### Caching Strategy

```javascript
// Cache membership plans (changes rarely)
const redis = require('redis');
const cache = redis.createClient();

app.get('/api/membership-plans', async (req, res) => {
  const cached = await cache.get('membership-plans');
  if (cached) return res.json(JSON.parse(cached));
  
  const plans = await MembershipPlan.find();
  cache.setex('membership-plans', 3600, JSON.stringify(plans)); // 1 hour
  res.json(plans);
});
```

### API Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Monitoring & Logging

### Recommended Tools

- **Logging**: Winston or Morgan
- **Monitoring**: Sentry or LogRocket
- **Database**: MongoDB Atlas dashboard
- **Analytics**: Google Analytics or Mixpanel

### Log Configuration

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
```

---

## Testing

### Unit Testing

```bash
npm install --save-dev jest
npm test
```

### E2E Testing

```bash
npm install --save-dev cypress
npx cypress open
```

---

## Maintenance & Updates

### Database Backups

```bash
# Automated daily backups recommended
mongodump --uri="mongodb+srv://..." --out=./backups/
```

### Security Updates

```bash
npm audit
npm audit fix
npm update
```

---

## Support & Documentation

For issues or questions:
1. Check the API documentation
2. Review error logs
3. Contact support team
4. Submit GitHub issue

---

**Last Updated**: 2026-06-14
**Version**: 1.0.0
**Status**: Production Ready
