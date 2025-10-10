// filepath: c:\Users\asus\React-App\react-ts-app\server.js
const express = require('express');
const app = express();
const PORT = 5000;

const cors = require('cors');
app.use(cors());
app.use(express.json());

const todos = [
  { userId: 1, id: 1, title: 'Learn JavaScript', completed: false },
]; 

app.get('/api/test', (req, res) => {
  res.send('API is working');
});

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const newTodo = {
    userId: req.body.userId,
    id: todos.length + 1,
    title: req.body.title,
    completed: req.body.completed,
  };
  // if userid is not number
  if (typeof newTodo.userId !== 'number' || isNaN(newTodo.userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});