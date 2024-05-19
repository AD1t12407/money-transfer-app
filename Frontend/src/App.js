import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const MoneyTransferForm = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Fetch list of users from backend
    axios.get('http://localhost:5002/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

    // Fetch user details
    axios.get('http://localhost:5002/api/user/details')
      .then(response => {
        setUserDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, []);

  const handleTransfer = () => {
    // Send money transfer request to backend
    axios.post('http://localhost:5002/api/transactions/transfer', {
      receiverId: selectedUser,
      amount: amount
    })
    .then(response => {
      setMessage('Money transferred successfully');
      // Reset form after successful transfer
      setSelectedUser('');
      setAmount(0);
      // Fetch updated user details
      axios.get('http://localhost:5002/api/user/details')
        .then(response => {
          setUserDetails(response.data);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    })
    .catch(error => {
      setMessage('Error transferring money');
      console.error('Error transferring money:', error);
    });
  };

  return (
    <div>
      <video autoPlay loop muted className="video-background">
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="money-transfer-form">
        <h2>Money Transfer</h2>
        {userDetails && (
          <div className="user-details">
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Balance:</strong> ${userDetails.balance.toFixed(2)}</p>
          </div>
        )}
        <select className="user-dropdown" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <input className="amount-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
        <button className="transfer-button" onClick={handleTransfer}>Transfer</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default MoneyTransferForm;
