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

# Quotes API Documentation

## Base URL

`localhost:3000/api/v1`

### Routes

#### 1. Create Quote

- **Endpoint:** `/quotes`
- **Method:** `POST`
- **Middleware:**
  - `authenticateUser`
- **Body:**

- `user_id`
- `mother_company`
- `invoice_id`, optional
- `chalan_id`, optional
- `purchaseOrder_id`, optional
- `client_id`
- `client_name`
- `client_address`
- `title`
- `job_no`
- `date`, optional
- `items` (array with details)
- `vat`, optional
- `asf`, optional
- `t_and_c`
- `bank_account`, optional
- `bank_name_address`, optional
- `swift`, optional
- `routing_no`, optional
- `brand`, optional
- `job_type`
- `grand_total`

- **Response:**
  - Status: 201
  - JSON containing details of the created quote

#### 2. Get All Quotes

- **Endpoint:** `/quotes`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of all quotes

#### 3. Get Quote by ID

- **Endpoint:** `/quotes/:id`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Quote ID
- **Response:**
  - Status: 200
  - JSON containing the details of the specified quote

#### 4. Delete Quote

- **Endpoint:** `/quotes/:id`
- **Method:** `DELETE`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Quote ID
- **Response:**
  - Status: 200
  - JSON containing delete confirmation message

#### 5. Update Quote

- **Endpoint:** `/quotes/:id`
- **Method:** `PATCH`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Quote ID
- **Body:**
  - `body part that will be updated`
- **Response:**
  - Status: 200
  - JSON containing the updated quote details

#### 6. Get Quote Serial Number

- **Endpoint:** `/quotes/getquoteserialnumber`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing the quote serial number

#### 7. Get Quotes by Month

- **Endpoint:** `/quotes/getquotesbymonth`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of quotes filtered by month

# Chalan API Documentation

## Base URL

`localhost:3000/api/v1`

### Routes

#### 1. Create Chalan

- **Endpoint:** `/chalans`
- **Method:** `POST`
- **Middleware:**
  - `authenticateUser`
- **Body:**
- `user_id`
- `quote_id`
- `mother_company`
- `client_id`
- `client_name`
- `client_address`
- `title`
- `job_no`
- `date`
- `items`
- `vat`
- `asf`
- `t_and_c`
- `bank_account`
- `bank_name_address`
- `swift`
- `routing_no`
- `brand`
- `job_type`
- `grand_total`
  **Response:**
  - Status: 201
  - JSON containing details of the created chalan

#### 2. Get All Chalans

- **Endpoint:** `/chalans`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of all chalans

#### 3. Get Chalan by ID

- **Endpoint:** `/chalans/:id`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Chalan ID
- **Response:**
  - Status: 200
  - JSON containing the details of the specified chalan

#### 4. Delete Chalan

- **Endpoint:** `/chalans/:id`
- **Method:** `DELETE`
- **Middleware:**
  - `authenticateUser`
  - `authorizeUser('admin')`
- **URL Parameters:**
  - `id`: Chalan ID
- **Response:**
  - Status: 200
  - JSON containing delete confirmation message

#### 5. Update Chalan

- **Endpoint:** `/chalans/:id`
- **Method:** `PATCH`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Chalan ID
- **Body:** [Details of the request body for updating a chalan]
- **Response:**
  - Status: 200
  - JSON containing the updated chalan details

#### 6. Get Chalan Serial Number

- **Endpoint:** `/chalans/getchalanserialnumber`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing the chalan serial number

#### 7. Get Chalans by Month

- **Endpoint:** `/chalans/getchalansbymonth`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of chalans filtered by month

# Invoice API Documentation

## Base URL

`localhost:3000/api/v1`

### Routes

#### 1. Create Invoice

- **Endpoint:** `/invoices`
- **Method:** `POST`
- **Middleware:**
  - `authenticateUser`
- **Body:**
- `user_id`
- `quote_id`
- `mother_company`
- `client_id`
- `client_name`
- `client_address`
- `title`
- `job_no`
- `date`
- `items`
- `vat`
- `asf`
- `advance1`
- `advance2`
- `advance3`
- `advance4`
- `total_advance`
- `due`
- `t_and_c`
- `bank_account`
- `bank_name_address`
- `swift`
- `routing_no`
- `brand`
- `job_type`
- `grand_total`
- **Response:**
  - Status: 201
  - JSON containing details of the created invoice

#### 2. Get All Invoices

- **Endpoint:** `/invoices`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of all invoices

#### 3. Get Invoice by ID

- **Endpoint:** `/invoices/:id`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Invoice ID
- **Response:**
  - Status: 200
  - JSON containing the details of the specified invoice

#### 4. Delete Invoice

- **Endpoint:** `/invoices/:id`
- **Method:** `DELETE`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Invoice ID
- **Response:**
  - Status: 200
  - JSON containing delete confirmation message

#### 5. Update Invoice

- **Endpoint:** `/invoices/:id`
- **Method:** `PATCH`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Invoice ID
- **Body:** [Details of the request body for updating an invoice]
- **Response:**
  - Status: 200
  - JSON containing the updated invoice details

#### 6. Get Invoice Serial Number

- **Endpoint:** `/invoices/getinvoiceserialnumber`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing the invoice serial number

#### 7. Get Invoices by Month

- **Endpoint:** `/invoices/getinvoicebymonth`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of invoices filtered by month

# Purchase Order API Documentation

## Base URL

`localhost:3000/api/v1`

### Routes

#### 1. Create Purchase Order

- **Endpoint:** `/purchaseorders`
- **Method:** `POST`
- **Middleware:**
  - `authenticateUser`
- **Body:**
- `user_id`
- `quote_id`
- `mother_company`
- `vendor_id`
- `vendor_name`
- `vendor_address`
- `title`
- `job_no`
- `date`
- `items`
- `vat`
- `asf`
- `t_and_c`
- `bank_account`
- `bank_name_address`
- `swift`
- `routing_no`
- `brand`
- `job_type`
- `grand_total`
- **Response:**
  - Status: 201
  - JSON containing details of the created purchase order

#### 2. Get All Purchase Orders

- **Endpoint:** `/purchaseorders`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of all purchase orders

#### 3. Get Purchase Order by ID

- **Endpoint:** `/purchaseorders/:id`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Purchase Order ID
- **Response:**
  - Status: 200
  - JSON containing the details of the specified purchase order

#### 4. Delete Purchase Order

- **Endpoint:** `/purchaseorders/:id`
- **Method:** `DELETE`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Purchase Order ID
- **Response:**
  - Status: 200
  - JSON containing delete confirmation message

#### 5. Update Purchase Order

- **Endpoint:** `/purchaseorders/:id`
- **Method:** `PATCH`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Purchase Order ID
- **Body:** [Details of the request body for updating a purchase order]
- **Response:**
  - Status: 200
  - JSON containing the updated purchase order details

#### 6. Get Purchase Order Serial Number

- **Endpoint:** `/purchaseorders/getpurchaseorderserialnumber`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing the purchase order serial number

#### 7. Get Purchase Orders by Quote

- **Endpoint:** `/purchaseorders/getpurchaseordersbyquote/:id`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Quote ID
- **Response:**
  - Status: 200
  - JSON containing an array of purchase orders related to the specified quote

#### 8. Get Purchase Orders by Vendor

- **Endpoint:** `/purchaseorders/getpurchaseordersbyvendor/:id`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Vendor ID
- **Response:**
  - Status: 200
  - JSON containing an array of purchase orders related to the specified vendor

#### 9. Get Purchase Orders by Month

- **Endpoint:** `/purchaseorders/getpurchaseordersbymonth`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of purchase orders filtered by month

# Vendor API Documentation

## Base URL

`localhost:3000/api/v1`

### Routes

#### 1. Create Vendor

- **Endpoint:** `/vendors`
- **Method:** `POST`
- **Middleware:**
  - `authenticateUser`
- **Body:**
- `user_id`
- `quote_id`
- `mother_company`
- `vendor_id`
- `vendor_name`
- `vendor_address`
- `title`
- `job_no`
- `date`
- `items`
- `vat`
- `asf`
- `t_and_c`
- `bank_account`
- `bank_name_address`
- `swift`
- `routing_no`
- `brand`
- `job_type`
- `grand_total`
- **Response:**
  - Status: 201
  - JSON containing details of the created vendor

#### 2. Get All Vendors

- **Endpoint:** `/vendors`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of all vendors

#### 3. Get Vendor by ID

- **Endpoint:** `/vendors/:id`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Vendor ID
- **Response:**
  - Status: 200
  - JSON containing the details of the specified vendor

#### 4. Delete Vendor

- **Endpoint:** `/vendors/:id`
- **Method:** `DELETE`
- **Middleware:**
  - `authenticateUser`
  - `authorizeUser('admin')`
- **URL Parameters:**
  - `id`: Vendor ID
- **Response:**
  - Status: 200
  - JSON containing delete confirmation message

#### 5. Update Vendor

- **Endpoint:** `/vendors/:id`
- **Method:** `PATCH`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Vendor ID
- **Body:** [Details of the request body for updating a vendor]
- **Response:**
  - Status: 200
  - JSON containing the updated vendor details

# Client API Documentation

## Base URL

`localhost:3000/api/v1`

### Routes

#### 1. Create Client

- **Endpoint:** `/clients`
- **Method:** `POST`
- **Middleware:**
  - `authenticateUser`
- **Body:**
- `mother_company`
- `client_name`
- `client_address`
- `client_contact_no`
- `client_representative1`
- `client_representative1_no`
- `client_representative2`
- `client_representative2_no`
- `bank_account`
- `bank_name_address`
- `swift`
- `routing_no`
- **Response:**
  - Status: 201
  - JSON containing details of the created client

#### 2. Get All Clients

- **Endpoint:** `/clients`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing an array of all clients

#### 3. Get Client by ID

- **Endpoint:** `/clients/:id`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Client ID
- **Response:**
  - Status: 200
  - JSON containing the details of the specified client

#### 4. Delete Client

- **Endpoint:** `/clients/:id`
- **Method:** `DELETE`
- **Middleware:**
  - `authenticateUser`
  - `authorizeUser('admin')`
- **URL Parameters:**
  - `id`: Client ID
- **Response:**
  - Status: 200
  - JSON containing delete confirmation message

#### 5. Update Client

- **Endpoint:** `/clients/:id`
- **Method:** `PATCH`
- **Middleware:**
  - `authenticateUser`
- **URL Parameters:**
  - `id`: Client ID
- **Body:** [Details of the request body for updating a client]
- **Response:**
  - Status: 200
  - JSON containing the updated client details

# Company API Documentation

## Base URL

`localhost:3000/api/v1`

### Routes

#### 1. Create Company

- **Endpoint:** `/companies`
- **Method:** `POST`
- **Middleware:**
  - `authenticateUser`
  - `authorizeUser("sass-admin")`
- **Body:**
- `mother_company`
- `company_remaining_amount`
- `mother_company_logo`
- `mother_company_image`
- `mother_company_default_bank_account`
- `mother_company_default_bank_name_address`
- `mother_company_default_routing_no`
- `mother_company_default_bank_routing_no`
- **Response:**
  - Status: 201
  - JSON containing details of the created company

#### 2. Get Quote and Invoice Six Month Total

- **Endpoint:** `/companies/sixmonthtotal`
- **Method:** `GET`
- **Middleware:**
  - `authenticateUser`
- **Response:**
  - Status: 200
  - JSON containing six-month total of quotes and invoices

### Notes

- Additional error handling and response details can be added based on the actual implementation.
- The body structure for creating a company should be specified according to the schema defined in the controller.
