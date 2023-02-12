import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Auth from './components/auth/Auth';
import Contact from './components/contact/Contact';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Room from './components/room/Room';
import NewRoom from './components/newRoom/NewRoom';


export default (
  <Routes>
    <Route path='/' element={<Auth />} />
    <Route path='/Dash' element={<Dashboard />} />
    <Route path='/Contact' element={<Contact />} />
    <Route path='/Profile' element={<Profile />} />
    <Route path='/Room/:id' element={<Room />} />
    <Route path='/NewRoom' element={<NewRoom />} />
  </Routes>
)