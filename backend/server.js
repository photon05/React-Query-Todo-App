import express from 'express';
import mongoose from 'mongoose';
import Todo from './models/Todo.js';
import User from './models/User.js';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

// MongoDB Connection

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB();

app.get('/', (req, res) => {
  res.send("This is the todo app");
})

app.get('/api/test', (req, res) => {
  res.send('API is working');
});

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { userId, title, completed } = req.body;

    if (typeof userId !== 'string') {
      console.log("Invalid Id:", userId)
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const newTodo = new Todo({ userId, title, completed });
    const response = await newTodo.save();
    res.status(201).json(response);
  } catch (err) {
    console.error('Error creating todo:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Register route (for testing): create a unique username and hashed password
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    // check unique username
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: "Username already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ username, password: hashed });
    await user.save();

    return res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * Login route: compare hashed password
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // For demo return minimal user info — in production return JWT/session
    return res.status(200).json({ message: "Login successful", user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Todo not found" });
    return res.status(200).json({ message: "Todo deleted", id: deleted._id });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});