import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react'; // Brought in for the premium loader

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OnBoarding from './pages/OnBoarding';
import Notification from './pages/Notification';
import Chat from './pages/Chat';
import Video from './pages/Video';
import useAuthUser from './hooks/useAuthUser';
import Layout from './components/Layout';
import Friends from './pages/Friends';
import About from './pages/About';



const App = () => {
  const { authUser, isLoading } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.onboarded;
  
  // Premium Root Loading State (Matches Layout.jsx)
  if (isLoading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-zinc-950 text-zinc-300">
        <div className="flex animate-pulse items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/80 px-5 py-3.5 shadow-xl shadow-black/40 backdrop-blur-sm">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
          <span className="text-sm font-medium tracking-wide">Authenticating...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        
        {/* ROOT ROUTE */}
        <Route 
          path='/' 
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <Home />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          } 
        />
        
        {/* AUTH ROUTES */}
        <Route 
          path='/login' 
          element={
            !isAuthenticated ? <Login /> : <Navigate to={!isOnBoarded ? "/onboarding" : "/"} replace />
          } 
        />
        
        <Route 
          path='/signup' 
          element={
            !isAuthenticated ? <Signup /> : <Navigate to={!isOnBoarded ? "/onboarding" : "/"} replace />
          } 
        />
        
        {/* ONBOARDING ROUTE */}
        <Route 
          path='/onboarding' 
          element={
            isAuthenticated ? (
              !isOnBoarded ? <OnBoarding /> : <Navigate to='/' replace />
            ) : (
              <Navigate to='/login' replace />
            )
          } 
        />
        
        {/* NOTIFICATIONS ROUTE */}
        <Route 
          path='/notifications' 
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <Notification />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          } 
        />
        
        {/* CHAT ROUTE */}
        <Route 
          path='/chat/:id' 
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={false}>
                <Chat />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          } 
        />
        
        {/* VIDEO CALL ROUTE */}
        <Route 
          path='/call/:id' 
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={false}>
                <Video />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          } 
        />

        <Route
          path="/friends"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <Friends />
              </Layout>
            ):(
              <Navigate to={!isAuthenticated ? "/login":"/onboarding"} replace/>
            )
          }
          />
          <Route
          path="/about"
          element={
            <Layout showSidebar={true}>
              <About />
            </Layout>
          }
          />

        
      </Routes>

      {/* GLOBAL TOAST CONFIGURATION - Mobile & Dark Mode Optimized */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#18181b', // bg-zinc-900
            color: '#f4f4f5',      // text-zinc-100
            border: '1px solid #27272a', // border-zinc-800
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981', // emerald-500
              secondary: '#18181b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#18181b',
            },
          },
        }}
      />
    </>
  );
};

export default App;