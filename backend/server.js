import express from 'express';
import mongoose from 'mongoose';
import Todo from './models/Todo.js';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

// MongoDB Connection

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
})

app.get('/', (req, res) => {
  res.send("This is the todo app");
})

app.get('/api/test', (req, res) => {
  res.send('API is working');
});

app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find()
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  try {
    const { userId, title, completed } = req.body;

    if (typeof userId !== 'number' || isNaN(userId)) {
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


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});