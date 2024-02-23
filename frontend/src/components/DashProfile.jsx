import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import {HiOutlineExclamationCircle} from "react-icons/hi"
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

const DashProfile = () => {
    const { currentUser,error } = useSelector(store => store.user);
    const [showModel,setShowModel]=useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [formData,setFormData]=useState({});
    const [updateMessage,setUpdateMessage]=useState(null)
    const filePickerRef = useRef();
    const [imageFileUploadSuccess,setImageFileUploadSuccess]=useState(null);
    const [signoutError,setSignoutError]=useState(null)
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }

    }, [imageFile])

    const uploadImage = async () => {
        setImageFileUploadSuccess(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadingProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadError('Image Must be less then 2MB')
                setImageFileUploadingProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploadSuccess(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({...formData,profilePicture:downloadURL});
                    setImageFileUploadSuccess(false);
                })
            }
        )
    }

    const handleChange=(e)=>
    {
        setFormData({...formData,[e.target.id]:e.target.value});
        
    }

    const dispatch=useDispatch()

    const handleSubmit=async(e)=>
    { 
        
        e.preventDefault();
        setUpdateMessage(null)
        if(Object.keys(formData).length===0)
        {
            return
        }

        try {
            dispatch(updateStart());
            const res=await fetch(`/api/user/update/${currentUser._id}`,
            {
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formData),
            })
            const data=await res.json();

            if(!res.ok)
            {
              return dispatch(updateFailure(data.error));
            }else{

                dispatch(updateSuccess(data))
                setImageFileUploadingProgress(null)
                setUpdateMessage("Profile Updated Successfully")
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
        }
    }


    const handleDeleteUser=async()=>
    {
       setShowModel(false);
       try {
        dispatch(deleteUserStart())
        const res=await fetch(`/api/user/delete/${currentUser._id}`,
        {
            method:'DELETE',
            
        })
        if(!res.ok)
        {
          dispatch(deleteUserFailure(data.error));
          setSignoutError(data.error);
        }
        else
        {
            dispatch(deleteUserSuccess())
        }
       } catch (error) {
        dispatch(deleteUserFailure(error.message));
        setSignoutError(error.message);
       }
    }

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
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
                    onClick={() => filePickerRef.current.click()}
                >
                    {imageFileUploadingProgress && (<CircularProgressbar value={imageFileUploadingProgress||0} text={`${imageFileUploadingProgress}%`}
                    strokeWidth={5}
                    styles={{
                        root:{
                            width:'100%',
                            height:'100%',
                            position:'absolute',
                            top:0,
                            left:0
                        },
                        path:{stroke:`rgb(62,152,199,${imageFileUploadingProgress/100})`}
                    }}/>
                    )}
                    <img src={imageFileUrl || currentUser?.profilePicture} alt='user'
                        className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover 
                        ${imageFileUploadingProgress && imageFileUploadingProgress<100 && 'opacity-50'}`} />
                </div>
                {imageFileUploadError && <Alert color={'failure'}> {imageFileUploadError} </Alert>}

                <TextInput type='text' id='username' placeholder='username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput type='email' id='email' placeholder='email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput type='password' id='password' placeholder='password'
                onChange={handleChange}
                />
                <Button type='submit' gradientDuoTone={'purpleToBlue'} outline disabled={imageFileUploadSuccess}>Update</Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursor-pointer' onClick={()=>setShowModel(true)}>Delete Account</span>
                <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
            </div>
            {error && (<Alert color='failure' className='mt-5'>
                {error}
            </Alert>)}
            {updateMessage && (<Alert color='success' className='mt-5'>
                {updateMessage}
            </Alert>) }
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
                        Are you sure you want to delete your account?
                       </h3>
                       <div className='flex justify-center gap-4'>
                        <Button color='failure' 
                        onClick={handleDeleteUser}
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

export default DashProfile