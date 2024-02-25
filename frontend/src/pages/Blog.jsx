import React, { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import { Spinner } from 'flowbite-react'

const Blog = () => {

  const [posts,setPosts]=useState([])
  const [loading,setLoading]=useState(true)
  const [showMore,setShowMore]=useState(true);
   useEffect(()=>
   {
    const fetchPosts=async()=>
    {
     try {
         const res=await fetch('/api/post/getPost')
         const data=await res.json();
         if(res.ok)
         {
          setLoading(false)
          setPosts(data.posts)
          if(data.posts.length<9){
            setShowMore(false)
         }
         }
        } catch (error) {
          console.log(error.message)
        }
    }
    fetchPosts();
   },[])

   const handleShowMore=async()=>
    {
       const startIndex=posts.length;
       try {
        const res= await fetch(`/api/post/getPost?startIndex=${startIndex}`);
        const data=await res.json();
       
        if(res.ok)
        {
            setPosts((prev)=>[...prev,...data.posts]);
            if(data.posts.length<9)
            {
                setShowMore(false);
            }
        }
       } catch (error) {
        console.log(error.message);
       }
   
    }

    if(loading)
    return (
       <div className='flex justify-center items-center min-h-screen w-full'>
    <Spinner size={'xl'}/>
     </div>);

  return (
    <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
       {
         posts && posts.length>0 && (
          <div className=''>
            <h2 className=' text-2xl font-semibold text-center'>Posts</h2>
            <div className='flex flex-wrap gap-4 mt-10 justify-center'>
              {
                posts.map((post)=>(<PostCard key={post._id} post={post}/> ))
              }
            </div>

            {showMore && (<button 
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>)}

          </div>
         )
       }
      </div>
  )
}

export default Blog