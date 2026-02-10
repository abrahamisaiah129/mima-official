# Application Functionalities & Testing Report

## Overview
This document outlines the core functionalities of the MIMA e-commerce platform (Client & Admin) and confirms that all features rely solely on the database, not local data files.

## 1. Client Application (`client/`)

### Functionalities
1.  **Authentication**:
    -   **Register**: Create a new account (Default role: `user`).
    -   **Login**: Authenticate with email/password.
    -   **Recover Password**: OTP-based password reset flow.
    -   **Logout**: Securely end session.
2.  **Product Browsing**:
    -   **Home**: View featured products and banners.
    -   **Shop**: Filter products by category (Heels, Sneakers, etc.) and search by name.
    -   **Product Details**: View images, select size/color, read description.
    -   **Stock Check**: Real-time stock validation (prevents adding out-of-stock items).
3.  **Shopping Cart**:
    -   Add products with specific variants (Size, Color).
    -   Update quantities.
    -   Remove items.
    -   Real-time total calculation.
4.  **Checkout & Payment**:
    -   **Address Input**: Capture shipping details.
    -   **PaymentModal**: Integration with Paystack (Test Mode) or Wallet balance.
    -   **Order Creation**: Generates order record in DB upon successful payment.
5.  **User Dashboard**:
    -   **Order History**: View past orders and status.
    -   **Profile**: Update personal information.

### Testing Status
- [x] **Data Source**: Confirmed all products and user data are fetched from MongoDB via `ShopContext` and `UserContext`. No local JSON files used.
- [x] **Cart Logic**: Confirmed cart state is managed correctly (initially empty from DB/Context).
- [x] **Empty State**: Verified application handles empty database gracefully (shows "No products found" vs crashing).

## 2. Admin Application (`admin/`)

### Functionalities
1.  **Dashboard Overview**:
    -   Real-time metrics: Total Revenue, Active Orders, Stock Level.
    -   Visual charts/graphs (if implemented).
2.  **Product Management**:
    -   **List**: View all products with pagination and search.
    -   **Add**: Create new products with image uploads (Cloudinary).
    -   **Edit**: Update price, stock, description, images.
    -   **Delete**: Remove products from catalog.
3.  **Order Management**:
    -   View all orders.
    -   Update status (Pending -> Processing -> Shipped -> Delivered).
    -   Print receipts.
4.  **User Management**:
    -   View registered users.
    -   View newsletter subscribers.
5.  **Marketing**:
    -   **Banners**: Upload/Manage homepage banners.
    -   **Newsletter**: Send email campaigns to subscribers.

### Testing Status
- [x] **Data Source**: Confirmed `Dashboard`, `ProductsTab`, `OrdersTab` fetch directly from API endpoints (`/products`, `/users`, `/orders`).
- [x] **Image Uploads**: Validated Cloudinary integration for product images and banners.
- [x] **Notifications**: Replaced all `alert()` calls with Toast Notifications for better UX.

## 3. Database Integration Reference
All data is stored in MongoDB. The application connects via `server/server.js` using Mongoose models:
- **Products**: `Product` model.
- **Users**: `User` model.
- **Orders**: `Order` model.
- **Newsletters**: `Newsletter` model.

## 4. Final Verification
- **Database Cleanup**: `clear_db.js` script successfully removed all seeded data.
- **Fresh Start**: The application is currently empty and ready for fresh user registration and product creation.

**Status:** ALL SYSTEMS OPERATIONAL.
