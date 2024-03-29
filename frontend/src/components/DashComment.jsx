import { Button, Modal, Spinner, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {HiOutlineExclamationCircle} from "react-icons/hi"


const DashComment = () => {
    const {currentUser}=useSelector(store=>store.user);
    const [comments,setComments]=useState([]);
    const [showMore,setShowMore]=useState(true);
    const [showModel,setShowModel]=useState(false);
    const [commentIdToDelete,setCommentIdToDelete]=useState("");
    const [loading,setLoading]=useState(true)

    useEffect(()=>
    {
       const  fetchComments=async()=>
       {
         try {
            const res= await fetch(`/api/comment/getComments`);
            const data=await res.json();
            if(res.ok)
            {
                setLoading(false)
                setComments(data.comments)
                if(data?.comments.length<9){
                    setShowMore(false)
                }
            }
         } catch (error) {
            setLoading(false)
            console.log(error.message)
         }
       }
       fetchComments();  
    },[currentUser._id])


    const handleShowMore=async()=>
    {
        
       const startIndex=comments.length;
       try {
        const res= await fetch(`/api/comment/getComments?startIndex=${startIndex}`);
        const data=await res.json();
        if(res.ok)
        {
            setComments((prev)=>[...prev,...data.comments]);
            if(data.comments.length<9)
            {
                setShowMore(false);
            }
        }
       } catch (error) {
        console.log("error",error.message);
       }
    }
 
   const handleDeleteComment=async()=>
   {
        setShowModel(false);
     try {
        const res=await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,{
            method:'DELETE'
        })
        const data=await res.json();
        if(!res.ok)
        {
            console.log(data.message)
        }else{
            setComments((prev)=>
            prev.filter((comment)=>comment._id!==commentIdToDelete));
        }
     } catch (error) {
        console.log(error.message)
     }

   }

   if(loading)
   return (
      <div className='flex justify-center items-center min-h-screen w-full'>
   <Spinner size={'xl'}/>
    </div>);

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {
            currentUser.isAdmin && comments.length>0 ?
            (<>
              <Table hoverable className='shadow-md'>
                <Table.Head className=''>
                    <Table.HeadCell>Date created</Table.HeadCell>
                    <Table.HeadCell>Comment</Table.HeadCell>
                    <Table.HeadCell>Number of likes</Table.HeadCell>
                    <Table.HeadCell >PostId</Table.HeadCell>
                    <Table.HeadCell>Username</Table.HeadCell>
                    <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                {
                    comments.map((comment)=>(
                        <Table.Body className='divide-y' key={comment._id}>
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                <Table.Cell>
                                    {new Date(comment.updatedAt).toLocaleDateString()}
                                </Table.Cell>
                                <Table.Cell>
                                    {comment.content}
                                </Table.Cell>
                                <Table.Cell>
                                    {comment.numberOfLikes}
                                </Table.Cell>
                                <Table.Cell>{comment.postId}</Table.Cell>
                                <Table.Cell>@{comment.userId.username}</Table.Cell>
                                <Table.Cell>
                                    <span className=' font-medium text-red-500 hover:underline
                                    cursor-pointer
                                    '
                                    onClick={()=>{setShowModel(true);
                                     setCommentIdToDelete(comment._id);
                                    }}
                                    >Delete</span>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))
                }
              </Table>
              {showMore && (<button 
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>)}
            </>):(<p>No comments are there!</p>)
        }
        <Modal show={showModel} 
            onClick={()=>setShowModel(false)}
            popup
            size={'md'}
            >
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                       <HiOutlineExclamationCircle className='h-14
                       w-14 text-gray-400 
                       dark:text-gray-200 mb-4
                       mx-auto
                       '/>
                       <h3 className=' mb-5 text-lg text-gray-500
                       dark:text-gray-400'>
                        Are you sure you want to delete this comment?
                       </h3>
                       <div className='flex justify-center gap-4'>
                        <Button color='failure' 
                        onClick={handleDeleteComment}
                        >
                            Yes, I'm sure
                        </Button>
                        <Button color='gray' onClick={()=>setShowModel(false)}>
                            No, cancel
                        </Button>
                       </div>
                    </div>
                </Modal.Body>
            </Modal>
    </div>
  )
}

export default DashComment