const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config();

const User = require('./models/User');
const OTP = require('./models/OTP');

const TEST_EMAIL = 'test_otp_user_' + Date.now() + '@example.com';
const TEST_PASSWORD = 'password123';
const NEW_PASSWORD = 'newpassword456';

// Helper function to make HTTP requests
function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/password' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTest() {
    console.log('--- STARTING OTP SMOKE TEST ---');

    try {
        // Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✔ MongoDB Connected for Test Script');

        // 1. Create Test User
        // Cleanup first just in case
        await User.findOneAndDelete({ email: TEST_EMAIL });

        const user = new User({
            email: TEST_EMAIL,
            password: 'hashed_placeholder', // Doesn't matter for this test
            firstName: 'Test',
            lastName: 'User'
        });
        await user.save();
        console.log(`✔ Created test user: ${TEST_EMAIL}`);

        // 2. Request OTP
        console.log('... Sending OTP Request (POST /send-otp) ...');
        const sendRes = await makeRequest('/send-otp', 'POST', { email: TEST_EMAIL });

        if (sendRes.status !== 200) {
            throw new Error(`Failed to send OTP: Status ${sendRes.status} - ${JSON.stringify(sendRes.body)}`);
        }
        console.log('✔ OTP Sent API Response: 200 OK');

        // 3. Retrieve OTP from DB (Intercept)
        // Wait a small delay for DB write
        await new Promise(r => setTimeout(r, 1000));

        const otpRecord = await OTP.findOne({ email: TEST_EMAIL }).sort({ createdAt: -1 });
        if (!otpRecord) {
            throw new Error('❌ OTP Document NOT found in MongoDB! Email sending might have failed internally or DB write failed.');
        }
        console.log(`✔ Intercepted OTP Code from DB: ${otpRecord.otp}`);

        // 4. Reset Password
        console.log('... Resetting Password (POST /reset-password) ...');
        const resetRes = await makeRequest('/reset-password', 'POST', {
            email: TEST_EMAIL,
            otp: otpRecord.otp,
            newPassword: NEW_PASSWORD
        });

        if (resetRes.status !== 200) {
            throw new Error(`Failed to reset password: Status ${resetRes.status} - ${JSON.stringify(resetRes.body)}`);
        }
        console.log('✔ Password Reset API Response: 200 OK');

        // 5. Verify User Password Changed (Optional - hash check logic omitted for brevity)
        // But 200 OK confirms route logic passed.

        console.log('--- TEST PASSED SUCCESSFULLY ---');

    } catch (error) {
        console.error('--- TEST FAILED ---');
        console.error(error.message);
        if (error.response) console.error(error.response.data);
    } finally {
        // Cleanup
        if (mongoose.connection.readyState !== 0) {
            await User.findOneAndDelete({ email: TEST_EMAIL });
            await OTP.deleteMany({ email: TEST_EMAIL });
            console.log('✔ Cleanup Complete');
            await mongoose.disconnect();
        }
    }
}

runTest();
