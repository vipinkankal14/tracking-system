import React, { Suspense } from 'react';
import AddCarStock from './AddCarStock';
import CarStockShow from './CarStockShow';
import CarAllotmentByCustomer from './CarAllotmentByCustomer';
import '../App.css';

const Car = () => {
  return (
    <div className="noto-sans">
      <Suspense fallback={<div>Loading AddCarStock...</div>}>
        <AddCarStock />
      </Suspense>
      <Suspense fallback={<div>Loading CarStockShow...</div>}>
        <CarStockShow />
      </Suspense>
      <Suspense fallback={<div>Loading CarAllotmentByCustomer...</div>}>
        <CarAllotmentByCustomer />
      </Suspense>
    </div>
  );
};

export default Car;
