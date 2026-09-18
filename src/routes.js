import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Auth from './components/auth/Auth';
import RequireAuth from './components/auth/RequireAuth';
import Contact from './components/contact/Contact';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Room from './components/room/Room';
import NewRoom from './components/newRoom/NewRoom';


export default (
  <Routes>
    <Route path='/' element={<Auth />} />
    <Route path='/Dash' element={<RequireAuth><Dashboard /></RequireAuth>} />
    <Route path='/Contact' element={<RequireAuth><Contact /></RequireAuth>} />
    <Route path='/Profile' element={<RequireAuth><Profile /></RequireAuth>} />
    <Route path='/Room/:id' element={<RequireAuth><Room /></RequireAuth>} />
    <Route path='/NewRoom' element={<RequireAuth><NewRoom /></RequireAuth>} />
  </Routes>
)