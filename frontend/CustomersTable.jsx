// components/CustomersTable.js
import React, { useEffect, useState } from 'react';

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fetch customer data from backend
    fetch('http://localhost:5000/api/customers')
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h2>Customers Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Account Balance</th>
        
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.accountBalance}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
