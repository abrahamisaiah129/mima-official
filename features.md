<!-- pending features  -->

<!-- Subtract the number of items from the available stock when the user submits the order checkout completion -->

## API Documentation (JSON Requests)

The following outlines the API structure for Client and Admin applications, specifying endpoints and server responses.

### 🛍️ Client API
These endpoints are used by the customer-facing store application.

#### **Products**
- **GET /products**
    - **Purpose**: Fetch all available products for the shop page.
    - **Returns**: `Array` of Product objects.
      ```json
      [ { "id": 1, "title": "Product Name", "price": 5000, ... }, ... ]
      ```
- **GET /most-searched**
    - **Purpose**: Fetch top 8 trending/searched products for suggestions.
    - **Returns**: `Array` of 8 Product objects.

#### **Users & Auth**
- **POST /users** (Registration)
    - **Purpose**: Register a new user account.
    - **Body**: `{ "email": "...", "password": "...", "firstName": "...", ... }`
    - **Returns**: `Object` (The created user profile).
- **GET /users** (Login/Verification)
    - **Purpose**: Fetch users to verify credentials (simplified auth).
    - **Returns**: `Array` of all User objects.
- **PATCH /users/:id**
    - **Purpose**: Update user profile (e.g., balance top-up).
    - **Body**: `{ "balance": 5000 }`
    - **Returns**: `Object` (The updated user).

#### **Orders**
- **POST /orders**
    - **Purpose**: Create a new order after checkout.
    - **Body**: `{ "email": "...", "items": [...], "total": 1000, "shipping": {...} }`
    - **Returns**: `Object` (The created order with ID).
- **GET /orders** (Track Order)
    - **Purpose**: Fetch all orders to filter for the logged-in user's history.
    - **Returns**: `Array` of all Order objects.

#### **Newsletter**
- **POST /newsletter**
    - **Purpose**: Subscribe a user to the mailing list.
    - **Body**: `{ "email": "user@example.com" }`
    - **Returns**: `Object`
      ```json
      { "success": true, "message": "Subscribed successfully!" }
      ```

#### **Utility**
- **POST /track-search**
    - **Purpose**: Log a search term for analytics.
    - **Body**: `{ "term": "shoes" }`
    - **Returns**: `{ "success": true }`
- **POST /send-otp**
    - **Purpose**: Trigger an email with an OTP for password reset.
    - **Body**: `{ "email": "user@example.com", "otp": "123456" }`
    - **Returns**: `{ "success": true }`
- **GET /otps** & **DELETE /otps/:id**
    - **Purpose**: Verify and invalidate used OTPs.

---

### 🛡️ Admin API
These endpoints are used by the separate Admin Dashboard.

#### **Dashboard Data**
- **GET /orders**
    - **Purpose**: View all customer orders.
    - **Returns**: `Array` of all Order objects.
- **GET /users**
    - **Purpose**: Manage customer accounts and view user base.
    - **Returns**: `Array` of all User objects.
- **GET /newsletters**
    - **Purpose**: View all subscribed emails for marketing.
    - **Returns**: `Array` of strings (emails).
      ```json
      [ "user1@example.com", "user2@example.com", ... ]
      ```
- **GET /admins**
    - **Purpose**: Authenticate admin users.
    - **Returns**: `Array` of Admin objects.

#### **Inventory Management**
*Note: Currently `server.js` supports read-only for products via API. Admin likely interacts directly or needs POST/PUT/DELETE endpoints implementation.*
- **GET /products**
    - **Purpose**: List all inventory items.
    - **Returns**: `Array` of Product objects.