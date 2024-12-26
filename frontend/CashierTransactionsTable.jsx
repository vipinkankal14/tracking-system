// components/CashierTransactionsTable.js
import React, { useEffect, useState } from 'react';

const CashierTransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch cashier transaction data from backend
    fetch('http://localhost:5000/api/cashier/all')
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h2>Cashier Transactions Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Debited Amount</th>
            <th>Status</th>
            
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
           
              <td>{transaction.user_id}</td>
              <td>{transaction.debitedAmount}</td>
              <td>{transaction.status}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashierTransactionsTable;
