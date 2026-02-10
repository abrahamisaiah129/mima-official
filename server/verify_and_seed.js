require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Category = require('./models/Category');
const Banner = require('./models/Banner');

const CATEGORIES = [
    {
        id: "Heels",
        title: "Heels",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
        count: "10+ Items"
    },
    {
        id: "Sneakers",
        title: "Sneakers",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
        count: "25+ Items"
    },
    {
        id: "Boots",
        title: "Boots",
        image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop",
        count: "15+ Items"
    },
    {
        id: "Flats",
        title: "Flats",
        image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
        count: "20+ Items"
    }
];

const BANNERS = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        type: "image"
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=2072&auto=format&fit=crop",
        type: "image"
    }
];

const PRODUCTS = [
    // HEELS
    {
        id: 1,
        title: "VELVET RED STILETTOS",
        category: "Heels",
        description: "Classic high heels with a velvet finish for elegant nights.",
        imageSrc: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
        price: 125000,
        rating: 5,
        sizes: ["36", "37", "38", "39", "40"],
        colors: [{ name: "Red", hex: "#DC2626" }, { name: "Black", hex: "#111827" }],
        stock: 50
    },
    {
        id: 6,
        title: "EMERALD SATIN PUMPS",
        category: "Heels",
        description: "Luxurious satin pumps with a pointed toe and slim heel.",
        imageSrc: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop", // Reusing red stilettos as placeholder
        price: 110000,
        rating: 4,
        sizes: ["36", "37", "38", "39"],
        colors: [{ name: "Emerald", hex: "#065F46" }],
        stock: 30
    },
    {
        id: 11,
        title: "GOLD STRAP SANDALS",
        category: "Heels",
        description: "Elegant gold strap sandals perfect for weddings and parties.",
        imageSrc: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
        price: 95000,
        rating: 5,
        sizes: ["36", "37", "38", "39", "40"],
        colors: [{ name: "Gold", hex: "#FFD700" }],
        stock: 40
    },

    // SNEAKERS
    {
        id: 2,
        title: "URBAN STREET RUNNER",
        category: "Sneakers",
        description: "Lightweight mesh sneakers designed for daily urban exploration.",
        imageSrc: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
        price: 85000,
        rating: 4,
        sizes: ["39", "40", "41", "42", "43", "44"],
        colors: [{ name: "Neon Orange", hex: "#FF5F1F" }, { name: "Ghost White", hex: "#F8F9FA" }],
        stock: 100
    },
    {
        id: 10,
        title: "NEON TRACER TRAINERS",
        category: "Sneakers",
        description: "Reflective accents for safety and style during night runs.",
        imageSrc: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
        price: 98000,
        rating: 4,
        sizes: ["39", "40", "41", "42", "43"],
        colors: [{ name: "Volt", hex: "#CEFF00" }],
        stock: 60
    },
    {
        id: 12,
        title: "RETRO HIGH TOPS",
        category: "Sneakers",
        description: "Vintage inspired high-top sneakers with a modern twist.",
        imageSrc: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
        price: 110000,
        rating: 5,
        sizes: ["40", "41", "42", "43", "44", "45"],
        colors: [{ name: "Multicolor", hex: "#3B82F6" }],
        stock: 25
    },

    // BOOTS
    {
        id: 3,
        title: "MIDNIGHT CHELSEA BOOTS",
        category: "Boots",
        description: "Premium suede leather boots with elastic side panels.",
        imageSrc: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop",
        price: 155000,
        rating: 5,
        sizes: ["40", "41", "42", "43"],
        colors: [{ name: "Midnight Black", hex: "#000000" }],
        stock: 20
    },
    {
        id: 7,
        title: "SAHARA DESERT BOOTS",
        category: "Boots",
        description: "Rugged yet stylish boots for outdoor adventures.",
        imageSrc: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop", // Replaced
        price: 135000,
        rating: 5,
        sizes: ["40", "41", "42", "43", "44"],
        colors: [{ name: "Sand", hex: "#C2B280" }],
        stock: 35
    },

    // CASUAL
    {
        id: 4,
        title: "VINTAGE CANVAS LOW",
        category: "Casual",
        description: "Classic canvas shoes for a timeless, laid-back look.",
        imageSrc: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
        price: 45000,
        rating: 4,
        sizes: ["38", "39", "40", "41", "42"],
        colors: [{ name: "Olive", hex: "#556B2F" }, { name: "Tan", hex: "#D2B48C" }],
        stock: 80
    },
    {
        id: 8,
        title: "CLOUD COMFORT SLIDERS",
        category: "Casual",
        description: "Ultra-soft foam sliders for lounging and poolside relaxation.",
        imageSrc: "https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800&auto=format&fit=crop",
        price: 25000,
        rating: 4,
        sizes: ["38", "39", "40", "41", "42", "43"],
        colors: [{ name: "Yellow", hex: "#FACC15" }, { name: "Grey", hex: "#6B7280" }],
        stock: 150
    },

    // SPORTS / FORMAL (Mixing to ensure 5+ categories)
    {
        id: 5,
        title: "SKYLINE PRO BASKETBALL",
        category: "Sports",
        description: "High-top performance shoes with maximum ankle support.",
        imageSrc: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", // Reused urban runner as placeholder
        price: 180000,
        rating: 5,
        sizes: ["42", "43", "44", "45", "46"],
        colors: [{ name: "Electric Blue", hex: "#2563EB" }],
        stock: 20
    },
    {
        id: 9,
        title: "OXFORD DERBY CLASSICS",
        category: "Formal",
        description: "Polished leather oxfords for formal occasions and work.",
        imageSrc: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
        price: 160000,
        rating: 5,
        sizes: ["40", "41", "42", "43", "44"],
        colors: [{ name: "Mahogany", hex: "#450A0A" }],
        stock: 15
    },
    {
        id: 13,
        title: "TRAIL BLAZER HIKERS",
        category: "Sports",
        description: "Durable hiking shoes for tough terrains.",
        imageSrc: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop", // Reused
        price: 140000,
        rating: 5,
        sizes: ["40", "41", "42", "43", "44", "45"],
        colors: [{ name: "Brown", hex: "#5D4037" }],
        stock: 25
    }
];

const USERS = [
    {
        id: "usr_1",
        firstName: "Abraham",
        lastName: "Isaiah",
        email: "abrahamisaiah129@gmail.com",
        password: "password123",
        role: "admin",
        balance: 1000000,
        active: true
    },
    {
        id: "usr_2",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "user",
        balance: 50000,
        active: true
    },
    {
        id: "usr_3",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: "password123",
        role: "user",
        balance: 150000,
        active: true
    },
    {
        id: "usr_4",
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.j@example.com",
        password: "password123",
        role: "user",
        balance: 0,
        active: true
    }
];

const verifyImages = async (products) => {
    console.log("Verifying images...");
    const errors = [];
    for (const p of products) {
        if (!p.imageSrc) {
            errors.push(`Product ${p.id} (${p.title}) missing image.`);
            continue;
        }
        try {
            const res = await fetch(p.imageSrc, { method: 'HEAD' });
            if (!res.ok) {
                errors.push(`Product ${p.id} (${p.title}) image failed: ${res.status}`);
            }
        } catch (err) {
            errors.push(`Product ${p.id} (${p.title}) image error: ${err.message}`);
        }
    }
    return errors;
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // 1. Verify Images
        const imageErrors = await verifyImages(PRODUCTS);
        if (imageErrors.length > 0) {
            console.error("Image Verification Errors:", imageErrors);
            // Decide whether to proceed or halt. Proceeding but logging error as requested.
        } else {
            console.log("All images verified successfully.");
        }

        // 2. Clear Database
        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});
        await Category.deleteMany({});
        await Banner.deleteMany({});
        console.log('Database cleared');

        // 3. Seed Products
        await Product.insertMany(PRODUCTS);
        console.log(`Seeded ${PRODUCTS.length} products across ${new Set(PRODUCTS.map(p => p.category)).size} categories.`);

        // 3b. Seed Categories & Banners
        await Category.insertMany(CATEGORIES);
        await Banner.insertMany(BANNERS);
        console.log(`Seeded ${CATEGORIES.length} categories and ${BANNERS.length} banners.`);

        // 4. Seed Users
        await User.insertMany(USERS);
        console.log(`Seeded ${USERS.length} users.`);

        // 5. Simulate Orders
        const orders = [];
        // User 2 buys Product 2 (Sneakers)
        orders.push({
            id: "ord_1",
            email: USERS[1].email,
            items: [{ id: 2, quantity: 1, title: PRODUCTS[3].title, price: PRODUCTS[3].price }], // Urban Street Runner is index 3 in this array?
            // PRODUCTS[3] is URBAN STREET RUNNER (id: 2) in this list. 
            // 0: VELVET RED (id: 1)
            // 1: EMERALD (id: 6)
            // 2: GOLD STRAP (id: 11)
            // 3: URBAN STREET (id: 2) -> CORRECT
            total: 85000,
            status: "Delivered",
            date: new Date().toISOString()
        });

        // User 3 buys Product 1 (Heels) and Product 4 (Casual)
        orders.push({
            id: "ord_2",
            email: USERS[2].email,
            items: [
                { id: 1, quantity: 1, title: PRODUCTS[0].title, price: PRODUCTS[0].price }, // VELVET RED (id: 1) -> Index 0
                { id: 4, quantity: 2, title: PRODUCTS[8].title, price: PRODUCTS[8].price } // VINTAGE CANVAS (id: 4) -> Index 8
                // 0: id 1
                // 1: id 6
                // 2: id 11
                // 3: id 2
                // 4: id 10
                // 5: id 12
                // 6: id 3
                // 7: id 7
                // 8: id 4 -> CORRECT
            ],
            total: 125000 + (45000 * 2),
            status: "Processing",
            date: new Date().toISOString()
        });

        await Order.insertMany(orders);
        console.log(`Simulated ${orders.length} orders.`);

        console.log("Seeding Complete!");
        process.exit(0);

    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
};

seed();
