const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mock Database
const users = [
  { id: 1, name: 'User 1', email: 'user1@example.com', password: 'password', balance: 1000 },
  { id: 2, name: 'User 2', email: 'user2@example.com', password: 'password', balance: 2000 },
  { id: 3, name: 'User 3', email: 'user3@example.com', password: 'password', balance: 1500 }
];

// Fetch User Details
app.get('/api/user/details', (req, res) => {
  // For simplicity, assume the logged-in user has ID 1
  const userId = 1;
  const user = users.find(user => user.id === userId);
  if (user) {
    res.json({ id: user.id, name: user.name, balance: user.balance });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Fetch Users
app.get('/api/users', (req, res) => {
  // Return list of all users
  res.json(users.map(user => ({ id: user.id, name: user.name })));
});

// Transfer Money
app.post('/api/transactions/transfer', (req, res) => {
  const { receiverId, amount } = req.body;
  const senderId = 1; // For simplicity, assume the logged-in user has ID 1

  const sender = users.find(user => user.id === senderId);
  const receiver = users.find(user => user.id === receiverId);

  if (!sender || !receiver) {
    return res.status(404).json({ error: 'Sender or receiver not found' });
  }

  if (sender.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Update balances
  sender.balance -= amount;
  receiver.balance += amount;

  res.json({ message: 'Money transferred successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
