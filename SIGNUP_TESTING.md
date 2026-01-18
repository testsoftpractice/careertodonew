# Signup Testing Guide

## Test Data

### Sample Student Signup
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "STUDENT",
  "universityId": "univ_001",
  "major": "Computer Science",
  "graduationYear": "2025",
  "bio": "Passionate about software development"
}
```

### Sample Employer Signup
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@company.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "EMPLOYER",
  "companyName": "TechCorp Inc.",
  "position": "Hiring Manager",
  "companyWebsite": "https://techcorp.com",
  "bio": "Looking for talented developers"
}
```

### Sample University Signup
```json
{
  "firstName": "University",
  "lastName": "Admin",
  "email": "admin@university.edu",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "UNIVERSITY_ADMIN",
  "universityName": "New University",
  "universityCode": "NEWUNI",
  "website": "https://newuniversity.edu",
  "bio": "Educational institution"
}
```

### Sample Investor Signup
```json
{
  "firstName": "Robert",
  "lastName": "Johnson",
  "email": "robert@venture.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "INVESTOR",
  "firmName": "Venture Capital Partners",
  "investmentFocus": "Technology Startups",
  "bio": "Investing in innovative ideas"
}
```

## Password Requirements

Passwords must include:
- At least 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&* etc.)

**Example valid passwords:**
- `Password123!`
- `MySecure@Pass1`
- `Test#2024Pass`

## Expected Responses

### Success Response (201)
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "clxxxxx",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "STUDENT",
    "verificationStatus": "PENDING"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Duplicate Email (400)
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error",
  "details": "Error details here"
}
```

## Testing Steps

### 1. Manual Testing via UI
1. Navigate to http://localhost:3000/auth
2. Click "Sign Up" tab
3. Fill out the form with test data
4. Click "Create Account"
5. Verify success message or error

### 2. Testing via API
```bash
# Test signup with curl
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "role": "STUDENT",
    "universityId": "univ_001",
    "major": "Computer Science",
    "graduationYear": "2025",
    "bio": "Passionate about development"
  }'
```

## Seeded Users for Testing

If you run the seed command, these users will be available for login:
- **Student:** `student1@example.com` → `password123`
- **Student:** `student2@example.com` → `password123`
- **Employer:** `employer1@example.com` → `password123`
- **Investor:** `investor1@example.com` → `password123`

## Common Issues

### Issue: "Internal server error"
**Cause:** Database not configured or schema not pushed
**Fix:** Run `npx prisma db push` before testing

### Issue: "User with this email already exists"
**Cause:** Email already in database
**Fix:** Use a different email or delete existing user from database

### Issue: Validation error on password
**Cause:** Password doesn't meet requirements
**Fix:** Ensure password has uppercase, lowercase, number, and special character

### Issue: "Validation error" without details
**Cause:** Missing required field for selected role
**Fix:** Check role-specific requirements:
  - STUDENT: universityId, major, graduationYear
  - EMPLOYER: companyName, position
  - INVESTOR: firmName, investmentFocus
  - UNIVERSITY_ADMIN: universityName, universityCode, website
