const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

// MongoDB connection string
const uri = "YOUR_MONGODB_CONNECTION_STRING";
const client = new MongoClient(uri);

// Serve static files
app.use(express.static("public"));
app.use(express.json()); // Parse JSON data

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
connectDB();

// Register a new user
app.post("/register", async (req, res) => {
  const { username, phone, password } = req.body;
  const db = client.db("coin-flip-game");
  const users = db.collection("users");

  // Check if user already exists
  const existingUser = await users.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Save new user
  await users.insertOne({ username, phone, password, balance: 1000 });
  res.json({ message: "User registered successfully" });
});

// Login a user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = client.db("coin-flip-game");
  const users = db.collection("users");

  // Find user
  const user = await users.findOne({ username, password });
  if (!user) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  res.json({ message: "Login successful", user });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});