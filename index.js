require('dotenv').config();
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// --- 1. IMPROVED DATABASE CONNECTION ---
// Prevents multiple connections in serverless environments
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};
connectDB();

// --- 2. SWITCH TO MEMORY STORAGE ---
// This stops the EROFS: read-only file system error
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// NOTE: For a real e-commerce site on Vercel, you should upload 
// the 'req.file.buffer' to Cloudinary here.
app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    
    // TEMPORARY placeholder since local storage is disabled
    res.json({
        success: 1,
        image_url: `IMAGE_UPLOADED_TO_MEMORY_PROCESSED_SUCCESSFULLY`,
        note: "To save permanently, integrate Cloudinary here."
    });
});

// Remove this line on Vercel as it won't work for dynamically uploaded files
// app.use('/images', express.static('upload/images'));

// --- 3. MIDDLEWARE & SCHEMAS (Keep as is, but add _id fix) ---
const fetchuser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send({ errors: "Please authenticate using a valid token" });
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

const Users = mongoose.models.Users || mongoose.model("Users", {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number },
    old_price: { type: Number },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

// --- 4. UPDATED CART LOGIC (Fixed _id usage) ---
app.post('/addtocart', fetchuser, async (req, res) => {
    // req.user.id from JWT must match the MongoDB _id
    let userData = await Users.findOne({ _id: req.user.id });
    if(!userData) return res.status(404).send("User not found");

    let cartData = userData.cartData;
    cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;
    
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: cartData });
    res.send("Added");
});

// ... Keep other routes (signup, login, etc.) as they were ...

app.get("/", (req, res) => {
    res.send("Express App is Running");
});

app.listen(port, (error) => {
    if (!error) console.log("Server Running on port " + port);
    else console.log("Error: ", error);
});

// Export for Vercel
module.exports = app;