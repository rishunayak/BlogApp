import React, { useState } from 'react'
import moment from "moment"
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Button, Modal, Textarea } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
const Comment = ({comment,onLike,onEdit,onDelete}) => {
   const {currentUser}=useSelector((store)=>store.user)
   const [isEditing,setIsEditing]=useState(false)
   const [editedContent,setEditedContent]=useState(comment.content)
   const [deleteComment,setDeleteComment]=useState(null)
   const [showModel,setShowModel]=useState(false)

   const handleEdit=()=>
   {
     setIsEditing(true);
   }

   const handleSave=async()=>
   {

      try {
        const res=await fetch(`/api/comment/editComment/${comment._id}`,{
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({content:editedContent})
        })
        if(res.ok)
        {
            setIsEditing(false);
            onEdit(comment,editedContent);
        }
      } catch (error) {
        console.log(error.messsage)
      }
   }


   const handleDeleteComment=async()=>
   {
    setShowModel(false)
    try {
        const res=await fetch(`/api/comment/deleteComment/${comment._id}`,{
            method:'DELETE'
        })
        if(res.ok)
        {
            onDelete(comment,editedContent);
        }
      } catch (error) {
        console.log(error.messsage)
      }
   }


  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm' >
        <div className='flex-shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full bg-gray-200' src={comment?.userId?.profilePicture} alt={comment?.userId?.username} />
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className=' font-bold mr-1 text-xs truncate'>
                    {comment?.userId?.username?`@${comment?.userId?.username}`:"anonymos user"}
                </span>
                <span className='text-gray-500 text-xs'>{moment(comment?.createdAt).fromNow()}</span>
            </div>
            {
                isEditing?
                <><Textarea
                 className='mb-2'
                 value={editedContent}
                 onChange={(e)=>setEditedContent(e.target.value)}
                /> 
                <div className='flex justify-end gap-2 text-xs'>
                    <Button type='button' size={'sm'} gradientDuoTone={'purpleToBlue'} onClick={handleSave}>Save</Button>
                    <Button type='button' size={'sm'} gradientDuoTone={'purpleToBlue'} outline onClick={()=>setIsEditing(false)}>Cancel</Button>
                </div>
                </>:
                <>
                <p className='text-gray-500 pb-2'>{comment?.content}</p>
            <div className='flex gap-2 text-xs pt-2 border-t dark:border-gray-700 max-w-fit'>
                <button type='button' onClick={()=>onLike(comment?._id)} className={`text-gray-400 hover:text-blue-500 
                ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}> 
                    <FaThumbsUp className='text-sm'/>
                </button>
                <p className='text-gray-400'>
                    {comment.numberOfLikes>0 && comment.numberOfLikes +" "+
                    (comment.numberOfLikes===1?"like":'likes')}
                </p>
                 {
                    currentUser && (currentUser._id === comment.userId._id || currentUser.isAdmin) && 
                    (<button type='button'
                      onClick={handleEdit}
                      className='text-gray-400 hover:text-blue-500'
                    >Edit</button>)
                    
                 }

                 {
                    currentUser && (currentUser._id === comment.userId._id || currentUser.isAdmin) && 
                    (<button type='button'
                      onClick={()=>{setShowModel(true);setDeleteComment(comment)}}
                      className='text-gray-400 hover:text-blue-500'
                    >Delete</button>)
                    
                 }
            </div>
             </>
            }
            
        </div>
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

export default Comment