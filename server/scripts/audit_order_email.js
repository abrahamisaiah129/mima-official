require('dotenv').config({ path: '../.env' }); // Load env from server root
const { sendOrderConfirmation } = require('../utils/mailer');

const mockOrder = {
    _id: "65c3f9b1e9b1e9b1e9b1e9b1",
    total: 45000,
    items: [
        {
            title: "Vintage oversized tee",
            quantity: 2,
            price: 15000,
            size: "L",
            color: "Black"
        },
        {
            title: "Cargo Pants",
            quantity: 1,
            price: 15000,
            size: "32",
            color: "Green"
        }
    ],
    shippingDetails: {
        firstName: "Test",
        lastName: "User",
        address: "123 Test St",
        city: "Lagos",
        state: "Lagos",
        phone: "08012345678"
    }
};

const recipientEmail = "abrahamisaiah129@gmail.com"; // Utilizing the email from env/context if available, otherwise defaulting to a test one or the user's email if comfortable. 
// Given the context, I'll use the one seen in .env or a generous placeholder.
// Actually, I should use the one from .env or just a dummy one and let the mailer log it if in mock mode.
// The user's .env had MAIL_USER=abrahamisaiah129@gmail.com. I will use that as recipient for the test/audit.

console.log("--- Starting Order Email Audit ---");
console.log(`Target Email: ${recipientEmail}`);
console.log("Mock Order Data:", JSON.stringify(mockOrder, null, 2));

sendOrderConfirmation(recipientEmail, mockOrder)
    .then(info => {
        console.log("✅ Email 1 (Full Details) sent successfully!");
        console.log("Message ID:", info.messageId);
    })
    .catch(err => console.error("❌ Email 1 failed:", err));

const mockOrderEmpty = { ...mockOrder, _id: "65c3f9b1e9b1e9b1e9b1e9b2", shippingDetails: {} };

sendOrderConfirmation(recipientEmail, mockOrderEmpty)
    .then(info => {
        console.log("✅ Email 2 (Empty Shipping) sent successfully!");
        console.log("Message ID:", info.messageId);
    })
    .catch(err => console.error("❌ Email 2 failed:", err));

const { sendOrderCancellation } = require('../utils/mailer');

sendOrderCancellation(recipientEmail, mockOrder)
    .then(info => {
        console.log("✅ Email 3 (Cancellation) sent successfully!");
        console.log("Message ID:", info.messageId);
    })
    .catch(err => console.error("❌ Email 3 failed:", err));
