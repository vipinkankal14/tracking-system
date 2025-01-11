// PaymentForm.js
import React from 'react';
 import CustomersTable from './CustomersTable';
import CashierTransactionsTable from './CashierTransactionsTable';
import './PaymentForm.scss';
 

 

const PaymentForm = () => {
 
 

  return (
    <div>
      <CustomersTable />
      <CashierTransactionsTable />
          

      
     
      
    </div>
  );
};

export default PaymentForm;
