import { Button, TextInput, Textarea } from 'flowbite-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

const CommentSection = ({postId}) => {
    const {currentUser}=useSelector(store=>store.user);
    const [comment,setComment]=useState('')

    const handleSubmit=async(e)=>
    {
       e.preventDefault()
       
    }
  return (
    <div className='max-2-xl mx-auto w-full p-3'>
        {currentUser?
         (
            <div className=' flex items-center gap-1 my-5 text-gray-500 text-sm'>
                <p>Signed in as:</p>
                <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt='porfile'/>
                <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-500 hover:underline'>
                    @{currentUser.username}
                </Link>
            </div>
         ):
         (
            <div className='text-sm text-teal-500 my-5 flex gap-1'>
                You must be signed in to comment.
                <Link className='text-blue-500 hover:underline' to={'/sign-in'}>Sign In</Link>
            </div>
         )}
         {currentUser && (
            <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                <Textarea
                 placeholder='Add a comment'
                 rows='3'
                 maxLength={'200'}
                 value={comment}
                 onChange={(e)=>setComment(e.target.value)}
                />
                <div className=' flex justify-between items-center mt-5'>
                    <p className=' text-gray-500 text-sm'>{200 - comment.length} characters remaining</p>
                    <Button outline gradientDuoTone={'purpleToBlue'} type='submit'>
                        Submit
                    </Button>
                </div>
            </form>
         )}
    </div>
  )
}

export default CommentSection