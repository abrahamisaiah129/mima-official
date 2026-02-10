const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Models
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Newsletter = require('./models/Newsletter');

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        const dbPath = path.join(__dirname, 'data', 'db.json');
        const rawData = fs.readFileSync(dbPath);
        const data = JSON.parse(rawData);

        // CLEAR EXISTING DATA (Optional, be careful)
        // await Product.deleteMany({});
        // await User.deleteMany({});
        // await Order.deleteMany({});
        // await Newsletter.deleteMany({});

        // SEED PRODUCTS
        if (data.products) {
            for (const p of data.products) {
                const exists = await Product.findOne({ id: p.id });
                if (!exists) {
                    await new Product(p).save();
                    console.log(`Seeded Product: ${p.title}`);
                }
            }
        }

        // SEED USERS
        if (data.users) {
            for (const u of data.users) {
                const exists = await User.findOne({ email: u.email });
                if (!exists) {
                    await new User(u).save();
                    console.log(`Seeded User: ${u.email}`);
                }
            }
        }

        // SEED ORDERS
        if (data.orders) {
            for (const o of data.orders) {
                const exists = await Order.findOne({ id: o.id });
                if (!exists) {
                    await new Order(o).save();
                    console.log(`Seeded Order: ${o.id}`);
                }
            }
        }

        // SEED NEWSLETTERS
        if (data.newsletters) {
            for (const email of data.newsletters) {
                const exists = await Newsletter.findOne({ email });
                if (!exists) {
                    await new Newsletter({ email }).save();
                    console.log(`Seeded Newsletter: ${email}`);
                }
            }
        }

        console.log('Seeding Complete');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
