# Invoicing and Quotation Management Solution for Digital Agencies

A comprehensive solution designed to streamline the management of invoicing and quotations for digital agencies.

## Steps to Run the API

1. **Clone the Repository**
   - Execute the following command to clone the repository:
     ```
     git clone [repository URL]
     ```

2. **Navigate to the Directory**
   - Change into the project directory with:
     ```
     cd [directory name]
     ```

3. **Install Dependencies**
   - Run the following command to install necessary dependencies:
     ```
     npm install
     ```

4. **Environment Setup**
   - Create a `.env` file in the root directory and add the following configurations:
     ```
     MONGO_URL=[Your MongoDB URL]
     JWT_SECRET=[Your JWT Secret]
     EXPIRY=[Your JWT Expiry Time]
     BDBULKSMS_TOKEN=[Your BD Bulk SMS Service Token]
     ```
   - Replace the placeholders (e.g., `[Your MongoDB URL]`) with your actual configuration values.


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

