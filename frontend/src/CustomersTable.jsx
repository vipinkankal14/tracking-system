import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import "./CustomersTable.scss";
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fetch customer data from backend
    fetch("http://localhost:5000/api/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDetailsClick = (id) => {
    alert(`Details for customer ID: ${id}`);
  };

  const handleEditClick = (id) => {
    alert(`Edit customer ID: ${id}`);
  };

  const handleDeleteClick = (id) => {
    alert(`Delete customer ID: ${id}`);
  };

  return (
    <div className="container mt-5 customers-table">
      <h2>Customers Table</h2>
      <div className="table-responsive">
        <table className="table ">
          <thead>
            <tr>
              <th className="" style={{padding:'6px'}}>ID</th>
              <th>Full Name</th>
              <th>Number</th>
              <th className="d-none d-sm-table-cell">Email</th>
              <th className="d-none d-sm-table-cell">Account Balance</th>
              <th style={{padding:'0px'}}></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td style={{padding:'10px'}}>{customer.id}</td>
                <td>
                  {customer.firstName} {customer.middleName} {customer.lastName}
                </td>
                <td  >{customer.mobileNumber1} {customer.mobileNumber2}</td>
                <td className="d-none d-sm-table-cell">{customer.email}</td>
                <td className="d-none d-sm-table-cell">{customer.accountBalance}</td>
                <td style={{padding:'10px'}}>
                  <Dropdown>
                    <Dropdown.Toggle
                      as="div"
                      bsPrefix="dropdown-toggle-custom"
                      id={`dropdown-${customer.id}`}
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{padding:'0px',fontSize:'9px',width:'0px',minWidth:'110px',textAlign:'center'}}>
                      <Dropdown.Item onClick={() => handleDetailsClick(customer.id)}>
                        <div style={{ display: 'flex', alignItems: 'center',fontWeight:'bold'}}>
                          <VisibilitySharpIcon style={{ fontSize: '14px', color:'blue',marginRight:'8px'}} /> View Details
                        </div>
                        
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleEditClick(customer.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', fontWeight:'bold' }}>
                        <EditIcon style={{ fontSize: '14px', color: 'blue', marginRight: '8px' }} />
                        Edit
                      </div>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteClick(customer.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', fontWeight:'bold' }}>
                        <DeleteIcon style={{ fontSize: '14px', color: 'red', marginRight: '8px' }} />
                        Delete
                      </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersTable;
