const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const generatePhone = () => {
    return `080${Math.floor(Math.random() * 90000000 + 10000000)}`;
};

const generateAddress = () => {
    const streets = ["Adetokunbo Ademola", "Awolowo Way", "Bourdillon Road", "Adeola Odeku", "Herbert Macaulay"];
    const cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan"];
    return `${Math.floor(Math.random() * 100) + 1}, ${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}`;
};

const migrate = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        let updatedCount = 0;

        // Using bulkWrite to update efficiently relative to individual updates, 
        // but since we need random data per user, we loop. 
        // We use updateOne to bypass schema validation of other fields.
        for (const user of users) {
            let updates = {};
            if (!user.phone) {
                updates.phone = generatePhone();
            }
            if (!user.address) {
                updates.address = generateAddress();
            }

            if (Object.keys(updates).length > 0) {
                // Use model.updateOne to update only specific fields without validating the whole doc
                await User.updateOne({ _id: user._id }, { $set: updates });
                updatedCount++;
                process.stdout.write(".");
            }
        }
        console.log(`\nMigration complete. Updated ${updatedCount} users.`);
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
