import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Auth from './components/auth/Auth';
import Chat from './components/chat/Chat';
import Contact from './components/contact/Contact';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Room from './components/room/Room';
import Rooms from './components/rooms/Rooms';


export default (
  <Switch>
    <Route exact path='/' component={Auth} />
    <Route path='/Dash' component={Dashboard} />
    <Route path='/Chat' component={Chat} />
    <Route path='/Contact' component={Contact} />
    <Route path='/Profile' component={Profile} />
    <Route path='/Room' component={Room} />
    <Route path='/Rooms' component={Rooms} />
  </Switch>
)