import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashProfile from '../components/DashProfile';
import DashPost from '../components/DashPost';
import DashSidebar from '../components/DashSidebar';
import DashUsers from '../components/DashUsers';
import DashComment from '../components/DashComment';
import DashboardComp from '../components/DashboardComp';

const Dashboard = () => {

  const location=useLocation()

  const [tab,setTab]=useState('')

  useEffect(()=>
  {
   const urlParams=new URLSearchParams(location.search)
   const tabFormUrl=urlParams.get('tab')
   if(tabFormUrl)
   {
    setTab(tabFormUrl)
   }
  },[location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>

      <div className='md:w-56'>
        <DashSidebar/>
      </div>
      {tab ==='profile' && <DashProfile/>}
      {tab==='posts' && <DashPost/>}
      {tab==='users' && <DashUsers/>}
      {tab==='comments' && <DashComment/>}
      {tab==='dash' && <DashboardComp/>}
    </div>
  )
}

export default Dashboard