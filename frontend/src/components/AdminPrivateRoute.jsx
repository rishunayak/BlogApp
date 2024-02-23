import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'

const AdminPrivateRoute = () => {
    const {currentUser}=useSelector(store=>store.user)
    return currentUser.isAdmin? <Outlet/>:<Navigate to={'/sign-in'}/>
}

export default AdminPrivateRoute