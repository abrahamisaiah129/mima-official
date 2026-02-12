const nodemailer = require('nodemailer');

// Initialize transporter with environment variables
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

/**
 * Verify the connection to the email server.
 */
const verifyMailer = () => {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.warn('⚠️  MAIL_USER or MAIL_PASS not defined. Email will run in MOCK mode.');
        return;
    }
    transporter.verify((error) => {
        if (error) {
            console.error('❌ Email server connection failed:', error.message);
        } else {
            console.log('✔ Email server ready');
        }
    });
};

/**
 * Generic mail sender
 */
const sendMail = async (options) => {
    // If credentials are missing, perform a mock send
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.log('--- MOCK EMAIL SEND ---');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.text || options.html);
        console.log('-----------------------');
        return { messageId: 'mock-id-' + Date.now() };
    }

    try {
        const info = await transporter.sendMail({
            from: options.from || `"MIMA" <${process.env.MAIL_USER}>`,
            ...options
        });
        return info;
    } catch (error) {
        console.error('Email Send Error:', error.message);
        throw error;
    }
};

/**
 * Send Password Reset OTP
 */
const sendOTP = async (email, otp) => {
    return sendMail({
        to: email,
        subject: "Your Password Reset OTP",
        html: `
            <div style="font-family: Arial; padding:20px; color: #000;">
              <h2>Password Reset Request</h2>
              <p>Use the OTP below to reset your password:</p>
              <h1 style="letter-spacing:6px; background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h1>
              <p>This OTP expires in <b>10 minutes</b>.</p>
              <br/>
              <small>If you did not request this, ignore this email.</small>
            </div>
        `
    });
};

/**
 * Send Newsletter
 */
const sendNewsletter = async (recipientEmails, subject, message) => {
    return sendMail({
        to: 'Undisclosed recipients: ;',
        bcc: recipientEmails,
        subject: subject,
        text: message,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #000; text-align: center;">MIMA Newsletter</h2>
                    <hr/>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr/>
                    <footer style="font-size: 12px; color: #888; text-align: center;">
                        You are receiving this because you subscribed to MIMA drops.
                    </footer>
                </div>
            </div>
        `
    });
};

/**
 * Send Welcome Email
 */
const sendWelcomeEmail = async (email) => {
    return sendMail({
        to: email,
        subject: "Welcome to MIMA! 🖤",
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #000000;">
                
                <!-- Header -->
                <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
                    <h1 style="color: #ffffff; letter-spacing: 8px; margin: 0; font-size: 24px;">MIMA</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 20px; text-align: center;">
                    <h2 style="text-transform: uppercase; letter-spacing: 2px; font-size: 20px; margin-bottom: 20px;">You're on the list.</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 30px;">
                        Welcome to the MIMA community. You are now first in line for:
                    </p>
                    
                    <ul style="list-style: none; padding: 0; margin-bottom: 40px; text-align: left; display: inline-block;">
                        <li style="margin-bottom: 10px; font-size: 14px;">Running exclusive drops before anyone else.</li>
                        <li style="margin-bottom: 10px; font-size: 14px;">Flash sales and limited-time offers.</li>
                        <li style="margin-bottom: 10px; font-size: 14px;">Behind-the-scenes content.</li>
                    </ul>

                    <br/>
                    <a href="https://mima-store.vercel.app/shop" style="background-color: #000000; color: #ffffff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; font-weight: bold; font-size: 12px; letter-spacing: 2px; display: inline-block;">
                        Shop New Arrivals
                    </a>
                </div>

                <!-- Footer -->
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
                    <p>&copy; ${new Date().getFullYear()} MIMA Store. All rights reserved.</p>
                    <p>Lagos, Nigeria</p>
                </div>
            </div>
        `
    });
};

/**
 * Send Order Confirmation Email
 */
const sendOrderConfirmation = async (email, order) => {
    const itemsList = order.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title} ${item.size ? `(${item.size})` : ''}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${item.price.toLocaleString()}</td>
        </tr>
    `).join('');

    const sd = order.shippingDetails || {};
    const shippingAddress = (sd.address && sd.firstName) ? `
        <div style="margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <h3 style="margin-top: 0; font-size: 16px;">Shipping Details</h3>
            <p style="margin: 0; color: #555;">
                ${sd.firstName || ''} ${sd.lastName || ''}<br>
                ${sd.address || ''}<br>
                ${sd.city || ''}, ${sd.state || ''}<br>
                ${sd.phone || ''}
            </p>
        </div>
    ` : '';

    return sendMail({
        to: email,
        subject: `Order Confirmation #${order._id.toString().slice(-6).toUpperCase()} - MIMA`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="background-color: #000; padding: 30px; text-align: center;">
                    <h1 style="color: #fff; margin: 0; letter-spacing: 5px;">MIMA</h1>
                </div>
                
                <div style="padding: 30px;">
                    <h2 style="text-align: center; margin-bottom: 30px;">Order Confirmed</h2>
                    <p>Thank you for your order. We've received it and are preparing it for shipment.</p>
                    
                    <div style="margin-bottom: 30px;">
                        <strong>Order ID:</strong> #${order._id.toString().toUpperCase()}<br>
                        <strong>Date:</strong> ${new Date().toLocaleDateString()}
                    </div>

                    ${shippingAddress}

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead>
                            <tr style="background-color: #f4f4f4;">
                                <th style="padding: 10px; text-align: left;">Item</th>
                                <th style="padding: 10px; text-align: center;">Qty</th>
                                <th style="padding: 10px; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsList}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total</td>
                                <td style="padding: 10px; text-align: right; font-weight: bold;">₦${order.total.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="${process.env.CLIENT_URL || 'https://mima-store.vercel.app'}/order/${order._id}" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
                    </div>
                </div>

                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    <p>&copy; ${new Date().getFullYear()} MIMA Store. All rights reserved.</p>
                </div>
            </div>
        `
    });
};

/**
 * Send Order Cancellation Email
 */
const sendOrderCancellation = async (email, order) => {
    return sendMail({
        to: email,
        subject: `Order Cancelled #${order._id.toString().slice(-6).toUpperCase()} - MIMA`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="background-color: #000; padding: 30px; text-align: center;">
                    <h1 style="color: #fff; margin: 0; letter-spacing: 5px;">MIMA</h1>
                </div>
                
                <div style="padding: 30px; text-align: center;">
                    <h2 style="margin-bottom: 20px; color: #d32f2f;">Order Cancelled</h2>
                    <p>Your order <strong>#${order._id.toString().toUpperCase()}</strong> has been cancelled as requested.</p>
                    
                    ${order.paymentMethod === 'wallet' ? '<p style="margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 8px; color: #2e7d32; font-weight: bold;">Refuded to your Wallet.</p>' : ''}
                    
                    <p style="margin-top: 30px; font-size: 14px; color: #666;">If you did not request this cancellation, please contact support immediately.</p>
                    
                    <div style="margin-top: 40px;">
                        <a href="${process.env.CLIENT_URL || 'https://mima-store.vercel.app'}/shop" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Continue Shopping</a>
                    </div>
                </div>

                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    <p>&copy; ${new Date().getFullYear()} MIMA Store. All rights reserved.</p>
                </div>
            </div>
        `
    });
};

module.exports = {
    transporter,
    verifyMailer,
    sendMail,
    sendOTP,
    sendNewsletter,
    sendWelcomeEmail,
    sendOrderConfirmation,
    sendOrderCancellation
};
