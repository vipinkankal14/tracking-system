import React from 'react'
import AdditionalApp from './AdditionalInfoApp/AdditionalApp'
  
const AdditionalInfo = ({ data, updateData, personalInfo, carInfo, orderInfo }) => {
  
  
  return (
    <div>
      
      <AdditionalApp
        data={data}
        updateData={updateData}
        personalInfo={personalInfo}
        carInfo={carInfo}
        orderInfo={orderInfo}
                
      />

      
    

    </div>
  )
}

export default AdditionalInfo