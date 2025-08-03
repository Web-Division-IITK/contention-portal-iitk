# 📚 Complete API Documentation - Contention Portal Backend

## 🏗️ System Overview

The Contention Portal is a feedback management system with pool-based organization, real-time communication via WebSocket, and role-based access control.

### 🎯 Key Features
- **Pool-based feedback system** with 5 pools
- **Role-based access** (admin vs user)
- **Real-time updates** via Socket.IO
- **JWT authentication** for secure access
- **Targeted broadcasting** for efficient communication

---

## 🌐 REST API Endpoints

### 📋 Base URL
```
http://localhost:8080
```

### 🔐 Authentication
All protected endpoints require JWT token in the `Authorization` heade+.

---

## 👤 User Management Endpoints

### 1. **POST** `/api/user/createUser`
**Description:** Create a new user account

**Authentication:** ✅ Required (Admin only)

**Request Body:**
```json
{
  "name": "string",         // User's full name
  "email": "string",        // Valid email address
  "password": "string",     // Password (will be hashed)
  "number": "string",       // Contact number
  "pool": "string"          // Pool assignment (Pool 1-5)
}
```

**Request Example:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "number": "9876543210",
  "pool": "Pool 1"
}
```

**Response - Success (201):**
```json
{
  "status": true,
  "message": "User created successfully"
}
```

**Response - Error (400):**
```json
{
  "status": false,
  "message": "All fields are required"
}
```
```json
{
  "status": false,
  "message": "User already exists"
}
```

**Validation Rules:**
- All fields are required
- Email must be unique
- Pool must be one of: "Pool 1", "Pool 2", "Pool 3", "Pool 4", "Pool 5"

---

### 2. **POST** `/api/user/login`
**Description:** Authenticate user and receive JWT token

**Authentication:** ❌ Not required

**Request Body:**
```json
{
  "email": "string",        // Registered email
  "password": "string"      // User password
}
```

**Request Example:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response - Success (200):**
```json
{
  "status": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response - Error (400):**
```json
{
  "status": false,
  "message": "All fields are required"
}
```
```json
{
  "status": false,
  "message": "Invalid credentials"
}
```

**JWT Token Payload:**
```json
{
  "id": "user_mongodb_id",
  "name": "John Doe",
  "email": "john@example.com",
  "number": "9876543210",
  "role": "user",
  "pool": "Pool 1"
}
```

---

## 🌍 Static File Serving

### **GET** `/*` (Catch-all)
**Description:** Serves React application for all unmatched routes

**Authentication:** ❌ Not required

**Response:** HTML file (React app)

---

## 🔌 WebSocket API (Socket.IO)

### 📡 Connection Setup

**URL:** `ws://localhost:8080`

**Authentication:** ✅ Required
```javascript
const socket = io("ws://localhost:8080", {
  auth: {
    token: "your_jwt_token_here"
  }
});
```

**Connection Events:**
- `connection` - User successfully connected
- `disconnect` - User disconnected

---

## 🎯 Socket Events

### 📥 **Incoming Events** (Client → Server)

#### 1. `submit_feedback`
**Description:** Submit new feedback (Users only)

**Authentication:** User role required

**Payload:**
```json
{
  "headline": "string",        // Brief title
  "description": "string",     // Detailed feedback
  "drive": "string",          // Optional drive link
  "againstPool": "string"     // Target pool (Pool 1-5)
}
```

**Example:**
```json
{
  "headline": "Improvement suggestion",
  "description": "The current system could be enhanced by...",
  "drive": "https://drive.google.com/...",
  "againstPool": "Pool 3"
}
```

**Behavior:**
- Creates feedback with status "pending"
- Assigns submitter's pool automatically
- Broadcasts to relevant rooms only

---

#### 2. `mark_accepted`
**Description:** Mark feedback as accepted (Admin only)

**Authentication:** Admin role required

**Payload:**
```json
{
  "id": "feedback_mongodb_id"
}
```

**Example:**
```json
{
  "id": "64f8a9b2c3d4e5f6a7b8c9d0"
}
```

---

#### 3. `mark_rejected`
**Description:** Mark feedback as rejected (Admin only)

**Authentication:** Admin role required

**Payload:**
```json
{
  "id": "feedback_mongodb_id"
}
```

**Example:**
```json
{
  "id": "64f8a9b2c3d4e5f6a7b8c9d0"
}
```

---

#### 4. `mark_pending`
**Description:** Mark feedback as pending (Admin only)

**Authentication:** Admin role required

**Payload:**
```json
{
  "id": "feedback_mongodb_id"
}
```

**Example:**
```json
{
  "id": "64f8a9b2c3d4e5f6a7b8c9d0"
}
```

---

### 📤 **Outgoing Events** (Server → Client)

#### 1. `load_feedbacks`
**Description:** Initial feedback data sent upon connection

**For Admin Users:**
```json
{
  "type": "grouped",
  "data": {
    "Pool 1": [
      {
        "_id": "64f8a9b2c3d4e5f6a7b8c9d0",
        "headline": "Feedback title",
        "description": "Feedback content",
        "drive": "https://drive.google.com/...",
        "pool": "Pool 1",
        "againstPool": "Pool 2",
        "status": "pending",
        "createdAt": "2025-01-01T10:00:00.000Z"
      }
    ],
    "Pool 2": [...],
    "Pool 3": [...],
    "Pool 4": [...],
    "Pool 5": [...]
  }
}
```

**For Regular Users:**
```json
{
  "type": "user_grouped",
  "data": {
    "byPool": [
      {
        "_id": "64f8a9b2c3d4e5f6a7b8c9d0",
        "headline": "Our feedback to Pool 3",
        "description": "Feedback content",
        "drive": "https://drive.google.com/...",
        "pool": "Pool 1",
        "againstPool": "Pool 3",
        "status": "accepted",
        "createdAt": "2025-01-01T10:00:00.000Z"
      }
    ],
    "againstPool": [
      {
        "_id": "64f8a9b2c3d4e5f6a7b8c9d1",
        "headline": "Feedback about us",
        "description": "Feedback about Pool 1",
        "drive": null,
        "pool": "Pool 2",
        "againstPool": "Pool 1",
        "status": "pending",
        "createdAt": "2025-01-01T11:00:00.000Z"
      }
    ]
  },
  "userPool": "Pool 1"
}
```

---

#### 2. `new_feedback`
**Description:** Real-time notification of new feedback submission

**Payload:**
```json
{
  "_id": "64f8a9b2c3d4e5f6a7b8c9d0",
  "headline": "New feedback title",
  "description": "Feedback content",
  "drive": "https://drive.google.com/...",
  "pool": "Pool 2",
  "againstPool": "Pool 4",
  "status": "pending",
  "createdAt": "2025-01-01T12:00:00.000Z"
}
```

**Recipients:**
- ✅ All admins
- ✅ Users in submitting pool
- ✅ Users in target pool

---

#### 3. `status_changed`
**Description:** Real-time notification of feedback status update

**Payload:**
```json
{
  "id": "64f8a9b2c3d4e5f6a7b8c9d0",
  "status": "accepted",
  "feedback": {
    "_id": "64f8a9b2c3d4e5f6a7b8c9d0",
    "headline": "Feedback title",
    "description": "Feedback content",
    "drive": "https://drive.google.com/...",
    "pool": "Pool 2",
    "againstPool": "Pool 4",
    "status": "accepted",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}
```

**Recipients:**
- ✅ All admins
- ✅ Users in original submitting pool
- ✅ Users in target pool

---

#### 4. `error`
**Description:** Error notification for failed operations

**Payload:**
```json
{
  "message": "Failed to submit feedback"
}
```

**Common Error Messages:**
- "Failed to load feedbacks"
- "Failed to submit feedback"
- "Failed to change status"

---

## 🏠 Socket Rooms System

### 🔐 Room Assignment

**Admin Users:**
- Joins: `admin` room
- Receives: All feedback updates

**Regular Users:**
- Joins: `pool_${userPool}` room (e.g., `pool_Pool 1`)
- Receives: Feedback relevant to their pool

### 📡 Broadcasting Logic

**New Feedback Submission:**
```
Broadcast to:
├── admin (all admins)
├── pool_${feedback.pool} (submitting pool users)
└── pool_${feedback.againstPool} (target pool users)
```

**Status Change:**
```
Broadcast to:
├── admin (all admins)
├── pool_${feedback.pool} (original submitters)
└── pool_${feedback.againstPool} (target pool users)
```

---

## 🗃️ Data Models

### 👤 User Model
```javascript
{
  name: String,           // Required
  email: String,          // Required, Unique
  passwordHash: String,   // Required (bcrypt hashed)
  role: String,          // Required ("user" or "admin")
  number: String,        // Required
  pool: String           // Required (Pool 1-5)
}
```

### 📝 Feedback Model
```javascript
{
  headline: String,       // Required
  description: String,    // Required
  drive: String,         // Optional
  createdAt: Date,       // Auto-generated
  status: String,        // "pending" | "accepted" | "rejected"
  pool: String,          // Submitter's pool (Pool 1-5)
  againstPool: String    // Target pool (Pool 1-5)
}
```

---

## 🛡️ Security & Authentication

### 🔐 JWT Authentication
- **Algorithm:** HS256
- **Expiration:** No expiration set (consider adding)
- **Required for:** Socket connections, protected REST endpoints

### 🎭 Role-Based Access Control

**Admin Privileges:**
- ✅ Create new users
- ✅ View all feedbacks grouped by pools
- ✅ Change feedback status
- ❌ Submit feedback

**User Privileges:**
- ✅ Submit feedback
- ✅ View pool-specific feedbacks
- ❌ Create users
- ❌ Change feedback status

### 🔒 Middleware Protection

**authAdmin:** Protects admin-only endpoints
- Validates JWT token
- Checks if user role is "admin"

**socketAuth:** Protects WebSocket connections
- Validates JWT token
- Attaches user data to socket

---

## 🚨 Error Handling

### HTTP Status Codes
- **200:** Success
- **201:** Created successfully
- **400:** Bad request / Validation error
- **401:** Unauthorized (missing/invalid token)
- **403:** Forbidden (insufficient permissions)
- **500:** Internal server error

### Socket Error Handling
- Errors emitted via `error` event
- Console logging for debugging
- Graceful fallbacks for failed operations

---

## 🔄 Environment Variables

**Required:**
```env
MONGO_URI=mongodb://localhost:27017/feedback-portal
JWT_SECRET=your-super-secret-jwt-key-here
PORT=8080
```

---

## 🚀 Usage Examples

### 🔗 JavaScript Client Examples

**Establishing Socket Connection:**
```javascript
const io = require('socket.io-client');
const socket = io('http://localhost:8080', {
  auth: { token: 'your_jwt_token' }
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('load_feedbacks', (data) => {
  console.log('Received feedbacks:', data);
});
```

**Submitting Feedback:**
```javascript
socket.emit('submit_feedback', {
  headline: 'Important suggestion',
  description: 'This is a detailed feedback...',
  drive: 'https://drive.google.com/file/d/xyz',
  againstPool: 'Pool 3'
});
```

**Admin Status Change:**
```javascript
socket.emit('mark_accepted', {
  id: '64f8a9b2c3d4e5f6a7b8c9d0'
});
```

### 📞 REST API Examples

**User Registration (Admin):**
```bash
curl -X POST http://localhost:8080/api/user/createUser \
  -H "Content-Type: application/json" \
  -H "Authorization: admin_jwt_token" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "password": "securepass123",
    "number": "9876543210",
    "pool": "Pool 1"
  }'
```

**User Login:**
```bash
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server  │◄──►│   MongoDB DB    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         │              ┌────────▼────────┐
         └──────────────►│  Socket.IO Hub  │
                         └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
            ┌───────▼──────┐ ┌───▼───┐ ┌─────▼─────┐
            │ Admin Room   │ │Pool 1 │ │  Pool 2   │
            │             │ │ Room  │ │   Room    │
            └─────────────┘ └───────┘ └───────────┘
```

This comprehensive documentation covers all endpoints, socket events, authentication mechanisms, and data structures used in the Contention Portal backend system.
