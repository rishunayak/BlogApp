import { Alert, Button, TextInput } from 'flowbite-react'
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
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

const DashProfile = () => {
    const { currentUser } = useSelector(store => store.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [formData,setFormData]=useState({})
    const filePickerRef = useRef()
    const [imageFileUploadSuccess,setImageFileUploadSuccess]=useState(null);
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
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
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
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}

export default DashProfile