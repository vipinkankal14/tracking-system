import React, { Suspense } from 'react'
import '../App.css';
import DiscountForCarAndAdditional from './DiscountForCarAndAdditional';
import BookingAmount from './BookingAmount';

const DiscountMain = () => {
  return (
    <div className="noto-sans">
    DiscountMain
    <Suspense fallback={<div>Loading...</div>}>
      <DiscountForCarAndAdditional/>
    </Suspense>
    <Suspense fallback={<div>Loading...</div>}>
    <BookingAmount />
    </Suspense>
    
  </div>
  )
}

export default DiscountMain
