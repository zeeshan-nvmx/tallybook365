# Invoicing and quotation management solution for digital agencies.

### steps to run the api:

1. clone the repository
2. cd into the directory
3. run 'npm install'
4. create a .env file in the root and put your mongodb url, JWT secret and expiry time in the .env file in this format
   - MONGO_URL
   - JWT_SECRET
   - EXPIRY
   - BDBULKSMS_TOKEN (Assuming you are using the bd bulk sms service)

# Authentication API Documentation

## Base URL
`[baseurl]/api/v1`

### Routes

#### 1. Register User
- **Endpoint:** `/register`
- **Method:** `POST`
- **Middleware:**
  - `authenticateUser`
  - `authorizeUser("sass-admin", "admin")`
- **Body:**
  - `name`: String (required)
  - `phone`: String, at least 11 digits (required)
  - `email`: String, valid email format (required)
  - `password`: String, at least 6 characters (required)
  - `mother_company`: String (optional)
  - `role`: Enum ['sass-admin', 'admin', 'user'] (optional)
  - `designation`: String (optional)
  - `profile_image`: String (optional)
  - `signature`: String (optional)
- **Response:**
  - Status: 201
  - JSON containing user token and registration message

#### 2. Login User
- **Endpoint:** `/login`
- **Method:** `POST`
- **Body:**
  - `phone`: String, at least 11 digits (required)
  - `password`: String, at least 6 characters (required)
- **Response:**
  - Status: 200
  - JSON containing user token and login message

#### 3. Logout User
- **Endpoint:** `/logout`
- **Method:** `POST`
- **Response:**
  - Status: 200
  - JSON containing logout message

#### 4. Request Password Reset
- **Endpoint:** `/requestPasswordReset`
- **Method:** `POST`
- **Body:**
  - `phone`: String, at least 11 digits (required)
- **Response:**
  - Status: 200
  - JSON containing OTP sent message

#### 5. Validate OTP and Reset Password
- **Endpoint:** `/validateOTPAndResetPassword`
- **Method:** `POST`
- **Body:**
  - `phone`: String, at least 11 digits (required)
  - `otp`: String, 4 digits (required)
  - `newPassword`: String, at least 6 characters (required)
- **Response:**
  - Status: 200
  - JSON containing password reset success message

### Notes
- Error handling: All endpoints are expected to throw `BadRequestError` with relevant messages for invalid inputs or other issues.
- Authentication and authorization mechanisms are not detailed in this document.

