require('dotenv').config();
const { sendOTP, sendNewsletter, sendMail, transporter } = require('./utils/mailer');

async function runTests() {
    console.log('--- STARTING EMAIL SYSTEM TESTS ---');

    console.log('\n1. Verifying SMTP Connection...');
    try {
        await new Promise((resolve, reject) => {
            transporter.verify((error) => {
                if (error) reject(error);
                else resolve();
            });
        });
        console.log('✔ SMTP Connection Verified');
    } catch (error) {
        console.error('❌ SMTP Connection Failed:', error.message);
        console.log('Note: If this fails, real emails will not be sent.');
    }

    const testEmail = process.env.MAIL_USER;
    if (!testEmail) {
        console.error('❌ MAIL_USER not found in .env. Cannot run delivery tests.');
        return;
    }

    console.log(`\n2. Sending Test OTP to ${testEmail}...`);
    try {
        const info = await sendOTP(testEmail, '123456');
        console.log('✔ OTP Email Sent:', info.messageId);
    } catch (error) {
        console.error('❌ OTP Email Failed:', error.message);
    }

    console.log(`\n3. Sending Test Newsletter to ${testEmail}...`);
    try {
        const info = await sendNewsletter([testEmail], 'Test Subject', 'This is a test newsletter message.');
        console.log('✔ Newsletter Email Sent:', info.messageId);
    } catch (error) {
        console.error('❌ Newsletter Email Failed:', error.message);
    }

    console.log(`\n4. Sending Generic Test Email to ${testEmail}...`);
    try {
        const info = await sendMail({
            to: testEmail,
            subject: 'Generic Test Email',
            text: 'This is a plain text test email.',
            html: '<b>This is a bold HTML test email.</b>'
        });
        console.log('✔ Generic Email Sent:', info.messageId);
    } catch (error) {
        console.error('❌ Generic Email Failed:', error.message);
    }

    console.log('\n5. Testing Mock Fallback (Temporary Credential Removal)...');
    const originalUser = process.env.MAIL_USER;
    const originalPass = process.env.MAIL_PASS;
    delete process.env.MAIL_USER;
    delete process.env.MAIL_PASS;

    try {
        const info = await sendMail({
            to: 'mock@example.com',
            subject: 'Mock Test',
            text: 'Should be mock'
        });
        if (info.messageId.startsWith('mock-id-')) {
            console.log('✔ Mock Fallback Working');
        } else {
            console.error('❌ Mock Fallback Failed: Got real-looking messageId', info.messageId);
        }
    } catch (error) {
        console.error('❌ Mock Fallback Crashed:', error.message);
    } finally {
        process.env.MAIL_USER = originalUser;
        process.env.MAIL_PASS = originalPass;
    }

    console.log('\n--- EMAIL SYSTEM TESTS COMPLETE ---');
}

runTests();
