# 👤 User Creation Scripts

This directory contains standalone Node.js scripts for creating users in the feedback portal database.

## 📁 Available Scripts

### 1. `createUser.js` - Interactive User Creation Tool
**Features:**
- ✨ Colorful, user-friendly interface
- ✅ Input validation and error handling
- 🔒 Password confirmation
- 📧 Email uniqueness check
- 📱 Phone number validation
- 🎨 Visual feedback and confirmation

### 2. `createUserSimple.js` - Minimal User Creation Script
**Features:**
- 🚀 Quick and simple interface
- ✅ Basic validation
- 📝 Minimal output
- 🏃‍♂️ Fast execution

## 🚀 Usage

### Prerequisites
1. Ensure MongoDB is running
2. Set up environment variables in `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/feedback-portal
   JWT_SECRET=your-secret-key
   ```

### Running the Scripts

#### Interactive Version:
```bash
node createUser.js
```

#### Simple Version:
```bash
node createUserSimple.js
```

## 📋 Required User Information

Both scripts will prompt for the following information:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| **Name** | String | Full name of the user | Required |
| **Email** | String | Valid email address | Required, Unique, Valid format |
| **Password** | String | User password | Required, Min 6 characters |
| **Phone Number** | String | Contact number | Required, 10 digits |
| **Role** | String | User role | Required (`user` or `admin`) |
| **Pool** | String | Pool assignment | Required (`Pool 1` to `Pool 5`) |

## 🎯 User Roles

### 👤 **User Role:**
- Can submit feedback
- Can view pool-specific feedbacks
- Cannot create other users
- Cannot change feedback status

### 🔧 **Admin Role:**
- Can create new users (via API)
- Can view all feedbacks
- Can change feedback status
- Cannot submit feedback

## 🏊‍♂️ Available Pools

- Pool 1
- Pool 2  
- Pool 3
- Pool 4
- Pool 5

## ⚠️ Important Notes

1. **Database Connection**: Ensure MongoDB is running and accessible
2. **Environment Variables**: Make sure `.env` file is properly configured
3. **Email Uniqueness**: Each email can only be used once
4. **Password Security**: Passwords are automatically hashed with bcrypt
5. **Validation**: Both scripts include input validation to prevent invalid data

## 🛠️ Troubleshooting

### Common Issues:

**"Cannot connect to database"**
- Check if MongoDB is running
- Verify MONGO_URI in `.env` file

**"User already exists"**
- Email addresses must be unique
- Try with a different email

**"Invalid pool/role"**
- Ensure you enter exact values as shown
- Pool names are case-sensitive

**"Validation Error"**
- Check that all required fields are filled
- Verify phone number is exactly 10 digits
- Ensure password is at least 6 characters

## 🔧 Script Features

### Error Handling
- Database connection errors
- Validation errors
- Duplicate email detection
- Graceful process interruption (Ctrl+C)

### Security
- Password hashing with bcrypt (salt rounds: 10)
- Input sanitization
- Database connection cleanup

### User Experience
- Clear prompts and instructions
- Color-coded output (in interactive version)
- Confirmation before creating user
- Progress indicators

## 📝 Example Usage

### Interactive Script Flow:
```
===========================================
         USER CREATION TOOL
===========================================

Connecting to database...
✓ Connected to MongoDB successfully

Enter user's full name: John Doe
Enter user's email: john.doe@example.com
Enter password (min 6 characters): securepass123
Enter phone number (10 digits): 9876543210

Available roles:
1. user
2. admin
Select role (1 for user, 2 for admin): 1

Available pools:
1. Pool 1
2. Pool 2
3. Pool 3
4. Pool 4
5. Pool 5
Select pool (1-5): 1

User Details:
Name: John Doe
Email: john.doe@example.com
Password: **************
Phone: 9876543210
Role: user
Pool: Pool 1

Create this user? (y/n): y

Hashing password...
Creating user in database...
✓ User created successfully!
User ID: 64f8a9b2c3d4e5f6a7b8c9d0
Database connection closed.
```

## 🔍 Validation Rules

- **Name**: Must not be empty
- **Email**: Must be valid format and unique in database  
- **Password**: Minimum 6 characters
- **Phone**: Must be exactly 10 digits (numbers only)
- **Role**: Must be either "user" or "admin"
- **Pool**: Must be one of the 5 available pools

These scripts provide a convenient way to create users without going through the API, making it easy for administrators to set up user accounts quickly and securely.
