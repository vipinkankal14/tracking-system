import React from 'react'
import AddCarStock from './AddCarStock'
import CarStockShow from './CarStockShow'
import '../App.css'
import CarAllotmentByCustomer from './CarAllotmentByCustomer'

const Car = () => {
  
  return (
    <div className='noto-sans'>
      <AddCarStock />
      <CarStockShow />
      <CarAllotmentByCustomer />
    </div>
  )
}

export default Car
