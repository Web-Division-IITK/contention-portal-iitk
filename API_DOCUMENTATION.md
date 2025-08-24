# 📚 Complete API Documentation - Contention Portal Backend

## 🏗️ System Overview

The Contention Portal is a contention management system with pool-based organization, real-time communication via WebSocket, and role-based access control.

### 🎯 Key Features
- **Pool-based contention system** with 5 pools
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
  "pool": "string"          // Pool assignment (Aryans-5)
}
```

**Request Example:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "number": "9876543210",
  "pool": "Aryans"
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
- Pool must be one of: "Aryans", "Kshatriyas", "Nawabs", "Peshwas", "Shauryas"

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
  "pool": "Aryans"
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

#### 1. `submit_contention`
**Description:** Submit new contention (Users only)

**Authentication:** User role required

**Payload:**
```json
{
  "problemStatement": "string",        // Brief title
  "description": "string",     // Detailed contention
  "drive": "string",          // Optional drive link
  "againstPool": "string"     // Target pool (Aryans-5)
}
```

**Example:**
```json
{
  "problemStatement": "Improvement suggestion",
  "description": "The current system could be enhanced by...",
  "drive": "https://drive.google.com/...",
  "againstPool": "Nawabs"
}
```

**Behavior:**
- Creates contention with status "pending"
- Assigns submitter's pool automatically
- Broadcasts to relevant rooms only

---

#### 2. `mark_accepted`
**Description:** Mark contention as accepted (Admin only)

**Authentication:** Admin role required

**Payload:**
```json
{
  "id": "contention_mongodb_id"
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
**Description:** Mark contention as rejected (Admin only)

**Authentication:** Admin role required

**Payload:**
```json
{
  "id": "contention_mongodb_id"
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
**Description:** Mark contention as pending (Admin only)

**Authentication:** Admin role required

**Payload:**
```json
{
  "id": "contention_mongodb_id"
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

#### 1. `load_contentions`
**Description:** Initial contention data sent upon connection

**For Admin Users:**
```json
{
  "type": "grouped",
  "data": {
    "Aryans": [
      {
        "_id": "64f8a9b2c3d4e5f6a7b8c9d0",
        "problemStatement": "contention title",
        "description": "contention content",
        "drive": "https://drive.google.com/...",
        "pool": "Aryans",
        "againstPool": "Kshatriyas",
        "status": "pending",
        "createdAt": "2025-01-01T10:00:00.000Z"
      }
    ],
    "Kshatriyas": [...],
    "Nawabs": [...],
    "Peshwas": [...],
    "Shauryas": [...]
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
        "problemStatement": "Our contention to Nawabs",
        "description": "contention content",
        "drive": "https://drive.google.com/...",
        "pool": "Aryans",
        "againstPool": "Nawabs",
        "status": "accepted",
        "createdAt": "2025-01-01T10:00:00.000Z"
      }
    ],
    "againstPool": [
      {
        "_id": "64f8a9b2c3d4e5f6a7b8c9d1",
        "problemStatement": "contention about us",
        "description": "contention about Aryans",
        "drive": null,
        "pool": "Kshatriyas",
        "againstPool": "Aryans",
        "status": "pending",
        "createdAt": "2025-01-01T11:00:00.000Z"
      }
    ]
  },
  "userPool": "Aryans"
}
```

---

#### 2. `new_contention`
**Description:** Real-time notification of new contention submission

**Payload:**
```json
{
  "_id": "64f8a9b2c3d4e5f6a7b8c9d0",
  "problemStatement": "New contention title",
  "description": "contention content",
  "drive": "https://drive.google.com/...",
  "pool": "Kshatriyas",
  "againstPool": "Peshwas",
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
**Description:** Real-time notification of contention status update

**Payload:**
```json
{
  "id": "64f8a9b2c3d4e5f6a7b8c9d0",
  "status": "accepted",
  "contention": {
    "_id": "64f8a9b2c3d4e5f6a7b8c9d0",
    "problemStatement": "contention title",
    "description": "contention content",
    "drive": "https://drive.google.com/...",
    "pool": "Kshatriyas",
    "againstPool": "Peshwas",
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
  "message": "Failed to submit contention"
}
```

**Common Error Messages:**
- "Failed to load contentions"
- "Failed to submit contention"
- "Failed to change status"

---

## 🏠 Socket Rooms System

### 🔐 Room Assignment

**Admin Users:**
- Joins: `admin` room
- Receives: All contention updates

**Regular Users:**
- Joins: `pool_${userPool}` room (e.g., `pool_Aryans`)
- Receives: contention relevant to their pool

### 📡 Broadcasting Logic

**New contention Submission:**
```
Broadcast to:
├── admin (all admins)
├── pool_${contention.pool} (submitting pool users)
└── pool_${contention.againstPool} (target pool users)
```

**Status Change:**
```
Broadcast to:
├── admin (all admins)
├── pool_${contention.pool} (original submitters)
└── pool_${contention.againstPool} (target pool users)
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
  pool: String           // Required (Aryans-5)
}
```

### 📝 contention Model
```javascript
{
  problemStatement: String,       // Required
  description: String,    // Required
  drive: String,         // Optional
  createdAt: Date,       // Auto-generated
  status: String,        // "pending" | "accepted" | "rejected"
  pool: String,          // Submitter's pool (Aryans-5)
  againstPool: String    // Target pool (Aryans-5)
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
- ✅ View all contentions grouped by pools
- ✅ Change contention status
- ❌ Submit contention

**User Privileges:**
- ✅ Submit contention
- ✅ View pool-specific contentions
- ❌ Create users
- ❌ Change contention status

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
MONGO_URI=mongodb://localhost:27017/contention-portal
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

socket.on('load_contentions', (data) => {
  console.log('Received contentions:', data);
});
```

**Submitting contention:**
```javascript
socket.emit('submit_contention', {
  problemStatement: 'Important suggestion',
  description: 'This is a detailed contention...',
  drive: 'https://drive.google.com/file/d/xyz',
  againstPool: 'Nawabs'
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
    "pool": "Aryans"
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
            │ Admin Room   │ │Aryans │ │  Kshatriyas   │
            │             │ │ Room  │ │   Room    │
            └─────────────┘ └───────┘ └───────────┘
```

This comprehensive documentation covers all endpoints, socket events, authentication mechanisms, and data structures used in the Contention Portal backend system.
