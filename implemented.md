# Implemented Features

## Feature 1: Stock Management (Inventory Tracking)
**Status:** Completed
**Description:** When an order is placed, the quantity of each item purchased is automatically subtracted from the product's available stock in the database.
**Implementation Details:**
- Backend: `POST /orders` endpoint updated to iterate through order items and update `Product` documents.
- Validation: Checks if sufficient stock exists before confirming order.


## Feature 2: API Documentation
**Status:** Completed
**Description:** Comprehensive list of API endpoints for Client and Admin applications.
**Location:** `features.md` & `/api-docs` page.

## Feature 3: Real Payment Integration
**Status:** Completed
**Description:** Paystack integration implemented for secure checkout.
**Location:** `PaymentModal.jsx`
