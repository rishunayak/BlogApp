import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

const SignUp = () => {

  const [formData,setFormData]=useState({});
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const nav=useNavigate()
  const handleChange=(e)=>
  {
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }

  const handleSubmit=async(e)=>
  {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password)
    {
      return setError('Please fill out all fields')
    }

    try {
      setLoading(true);
      setError(null);
      const res=await fetch('/api/auth/signup',{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      });
      const data= await res.json()
      if(data.error)
      {
        return setError(data.error)
      }
      if(res.ok)
      {
        nav("/sign-in")
      }
    } catch (error) {
      setError(error.message)
    }finally
    {
      setLoading(false);
    }

  }
  return (
    <div className='min-h-screen mt-20'>
      <div className=' flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
         
         <div className='flex-1'>
          <Link to="/" className='font-bold  dark:text-white text-4xl'>
             <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                 Rishu's
             </span>Blog
          </Link>
          <p className='text-sm mt-5'>This is a Blog project. You can sign up with your email and password or with Google</p>
         </div>

         <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username'/>
              <TextInput type='text' placeholder='Username' id='username' onChange={(e)=>handleChange(e)}/>
            </div>
            <div>
              <Label value='Your email'/>
              <TextInput type='email' placeholder='Email' id='email' onChange={(e)=>handleChange(e)}/>
            </div>
            <div>
              <Label value='Your password'/>
              <TextInput type='password' placeholder='Password' id='password' onChange={(e)=>handleChange(e)}/>
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {loading?<><Spinner size={'sm'}/><span className='pl-3'>Loading...</span></>:"Sign Up"}
              </Button>
              <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to="/sign-in" className='text-blue-500'> Sign In</Link>
          </div>
          {error && <Alert className='mt-5' color={"failure"}>{error}</Alert>}
         </div>
      </div>
    </div>
  )
}

export default SignUp

