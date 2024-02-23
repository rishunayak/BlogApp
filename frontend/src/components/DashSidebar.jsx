import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {HiArrowSmRight, HiDocumentText, HiUser} from "react-icons/hi"
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'

const DashSidebar = () => {
    const location=useLocation();
   const dispatch=useDispatch();
  const [tab,setTab]=useState('');
  const {currentUser}=useSelector(store=>store.user);
  useEffect(()=>
  {
   const urlParams=new URLSearchParams(location.search)
   const tabFormUrl=urlParams.get('tab')
   if(tabFormUrl)
   {
    setTab(tabFormUrl)
   }
  },[location.search])

  const handleSignout=async()=>
    {
      try {
        const res=await fetch('/api/user/signout',{
            method:'POST'
        });
        const data=await res.json();
        if(!res.ok)
        {
          console.log(data.error)  
        }else
        {
            dispatch(signoutSuccess())
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  return (
     <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to={'/dashboard?tab=profile'}>
                <Sidebar.Item active={tab=='profile'} icon={HiUser} label={currentUser.isAdmin?'Admin':'User'} lablecolor='dark' as='div'>
                  Profile
                </Sidebar.Item>
                </Link>
                {currentUser.isAdmin &&
                <Link to={"/dashboard?tab=posts"}>
                  <Sidebar.Item
                     active={tab==='posts'}
                     icon={HiDocumentText}
                     as='div'
                     >
                      Posts
                     </Sidebar.Item>
                </Link> }
                <Sidebar.Item 
                onClick={handleSignout}
                icon={HiArrowSmRight} className='cursor-pointer'>
                  Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
     </Sidebar>
  )
}

export default DashSidebar;