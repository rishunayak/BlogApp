import React from 'react'
import {Route, Routes} from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import FooterComponent from './components/FooterComponent'
import PrivateRoute from './components/PrivateRoute'
import { useSelector } from 'react-redux'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import CreatePost from './pages/CreatePost'


const App = () => {
  const {currentUser}=useSelector(store=>store.user)

  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>} />
        <Route path='/sign-in' element={currentUser?<Home/>:<SignIn/>} />
        <Route path='/sign-up' element={currentUser?<Home/>:<SignUp/>} />
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>} />
        </Route>
    
        <Route  element={<AdminPrivateRoute/>}>
          <Route path='/create-post' element={<CreatePost/>}/>
        </Route>

      </Routes>
      <FooterComponent/>
    </>
  )
}

export default App