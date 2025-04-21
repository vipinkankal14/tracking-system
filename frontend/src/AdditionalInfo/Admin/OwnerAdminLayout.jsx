import React from 'react'
import { Outlet } from 'react-router-dom'

function OwnerAdminLayout() {
  return (
    <div>
          <Outlet />
      </div>
  )
}

export default OwnerAdminLayout
