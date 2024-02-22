// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log(import.meta.env.Firebase_API)
const firebaseConfig = {
  apiKey: "AIzaSyAU7wjExt5lynAgRJ7KaD67iqORFuvU-Ic",
  authDomain: "blog-43314.firebaseapp.com",
  projectId: "blog-43314",
  storageBucket: "blog-43314.appspot.com",
  messagingSenderId: "645959421307",
  appId: "1:645959421307:web:3bca5258e718aeaf0b81de"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);