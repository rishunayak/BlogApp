import React from 'react'
import moment from "moment"
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'
const Comment = ({comment,onLike}) => {
   const {currentUser}=useSelector((store)=>store.user)

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
            <p className='text-gray-500 pb-2'>{comment?.content}</p>
            <div className='flex gap-2 text-xs'>
                <button type='button' onClick={()=>onLike(comment?._id)} className={`text-gray-400 hover:text-blue-500 
                ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}> 
                    <FaThumbsUp className='text-sm'/>
                </button>
                <p className='text-gray-400'>
                    {comment.numberOfLikes>0 && comment.numberOfLikes +" "+
                    (comment.numberOfLikes===1?"like":'likes')}
                </p>
            </div>
        </div>
    </div>
  )
}

export default Comment