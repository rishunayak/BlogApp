import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CreatePost = () => {

  const [file,setFile]=useState(null)
  const [imageFileUploadingProgress,setImageFileUploadingProgress]=useState(null)
  const [imageUploadError,setImageUploadError]=useState(null);
  const [formData,setFormData]=useState({});
  const handleUploadImage=async()=>
  {
     try {
        if(!file)
        {
            setImageUploadError('Please select an image')
            return
        }
        setImageUploadError(null)
        const storage=getStorage(app);
        const fileName=new Date().getTime()+ '-'+file.name;
        const storageRef=ref(storage,fileName);
        const uploadTask=uploadBytesResumable(storageRef,file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadingProgress(progress.toFixed(0))
            },
            (error) => {
                setImageUploadError('Image Must be less then 2MB')
                setImageFileUploadingProgress(null);
              
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                   // setImageFileUrl(downloadURL);
                    setFormData({...formData,image:downloadURL});
                    setImageFileUploadingProgress(null);
                    setImageUploadError(null);
                })
            }
        )
     } catch (error) {
        setImageUploadError("Image Upload failed")
        setImageFileUploadingProgress(null);
        console.log(error.message);
     }
  }
  console.log(formData)
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
            Create a post
        </h1>
        <form className='flex flex-col gap-4'>
           <div className='flex flex-col gap-4 sm:flex-row justify-between'>
             <TextInput type='text' placeholder='Title' required id='title' className='flex-1'/>
              <Select >
                <option value={'uncategorized'}>Select a cateory</option>
                <option value={'javascript'}>JavaScript</option>
                <option value={'reactjs'}>React.js</option>
                <option value={'nextjs'}>Next.js</option>
              </Select>
           </div>
           <div className='flex gap-4 items-center justify-between
           border-4  border-teal-500 border-dotted p-3
           '>
              <FileInput type='file' accept='image/*'
              onChange={(e)=>setFile(e.target.files[0])}
              />
              <Button type='button' gradientDuoTone={'purpleToBlue'}
              size={'sm'} outline
              onClick={handleUploadImage}
              disabled={imageFileUploadingProgress}
              >
                {imageFileUploadingProgress?
                <div className='w-16 h-16'>
                    <CircularProgressbar value={imageFileUploadingProgress}
                    text={`${imageFileUploadingProgress||0}%`}/>
                </div>:"Upload Image"}
              </Button>
           </div>
           {imageUploadError && <Alert color={'failure'}>{imageUploadError}</Alert>}
         
           {formData.image && <img src={formData.image} alt='upload'
          className='w-full h-72 object-cover'/>   
          }
           <ReactQuill className='h-72 mb-12'  required theme="snow" placeholder='Write something...'  />
           <Button type='button' gradientDuoTone={'purpleToPink'}>Publish</Button>
        </form>
    </div>
  )
}

export default CreatePost