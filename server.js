import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/futuretech", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // For Google sign-in, password can be null
  provider: { type: String, default: "local" },
});
const User = mongoose.model("User", UserSchema);

// ✅ Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password, provider: "local" });
    await user.save();
    res.status(201).json({ message: "User signed up successfully", user });
  } catch (err) {
    res.status(400).json({ message: "Error signing up", error: err.message });
  }
});

// ✅ Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Google Login (mock)
app.post("/api/google-login", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email, provider: "google" });
    if (!user) {
      user = new User({ email, provider: "google" });
      await user.save();
    }
    res.json({ message: "Google login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
});

app.get("/", (req, res) => res.send("🚀 FutureTech Careers API running..."));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
