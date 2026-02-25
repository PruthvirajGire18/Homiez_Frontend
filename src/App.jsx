import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OnBoarding from './pages/OnBoarding'
import Notification from './pages/Notification'
import Chat from './pages/Chat'
import Video from './pages/Video'
import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout'

const App = () => {
  const {authUser,isLoading}=useAuthUser();
  const isAuthenticated=Boolean(authUser);
  const isOnBoarded=authUser?.onboarded;
  
  if(isLoading){
    return (
      <div className="grid min-h-screen place-items-center bg-zinc-950 text-zinc-200">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 shadow-lg shadow-black/30">
          <span className="loading loading-spinner loading-sm text-primary" />
          <span className="text-sm font-medium">Please wait...</span>
        </div>
      </div>
    )
  }

  return (
    <>
    <Routes>
      <Route path='/' element={isAuthenticated && isOnBoarded?(
        <Layout showSidebar={true}>
          <Home/>
        </Layout>
      ):(
        <Navigate to={!isAuthenticated? "/login":"/onboarding"} />
      )} />
      <Route path='/login' element={!isAuthenticated?<Login/>:<Navigate to={!isOnBoarded? "/onboarding":"/"} />} />
      <Route path='/signup' element={!isAuthenticated?<Signup/>:<Navigate to={!isOnBoarded? "/onboarding":"/"} />} />
      <Route path='/onboarding' element={isAuthenticated?(
        !isOnBoarded?(
          <OnBoarding/>
        ):(
          <Navigate to='/' />
        )
      ):(
        <Navigate to='/login' />
      )} />
      <Route path='/notifications' element={
        isAuthenticated && isOnBoarded ?(
          <Layout showSidebar={true}>
            <Notification/>
          </Layout>
        ):(
          <Navigate to={!isAuthenticated?"/login":"/onboarding"} />
        )
      } />
      <Route path='/chat/:id' element={isAuthenticated && isOnBoarded?(
        <Layout showSidebar={false}>
          <Chat/>
        </Layout>
      ):(
        <Navigate to={!isAuthenticated?"/login":"/onboarding"} />
      )} />
      <Route path='/call/:id' element={isAuthenticated && isOnBoarded?(
        <Layout showSidebar={false}>
          <Video/>
        </Layout>
      ):(
        <Navigate to={!isAuthenticated?"/login":"/onboarding"} />
      )} />
    </Routes>
    <Toaster/>
    </>
  )
}

export default App
