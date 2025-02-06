const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// ✅ Use the corrected MongoDB connection string (REPLACE `USERNAME`, `PASSWORD`, `DATABASE_NAME`)
const uri = "mongodb+srv://fjn4bussiness:nabadilisha@cluster0coinflipgame.l3fth.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0CoinFlipGame";

// ✅ Create MongoDB client (only required settings)
const client = new MongoClient(uri, {
  tls: true, // Ensures TLS 1.2
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  }
}
connectDB();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register User
app.post("/register", async (req, res) => {
  try {
    const { username, phone, password } = req.body;
    const db = client.db("coin-flip-game");
    const users = db.collection("users");

    // Check if user exists
    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    await users.insertOne({ username, phone, password, balance: 1000 });
    res.json({ message: "✅ User registered successfully" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = client.db("coin-flip-game");
    const users = db.collection("users");

    const user = await users.findOne({ username, password });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    res.json({ message: "✅ Login successful", user });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
