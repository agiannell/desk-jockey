import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Auth from './components/auth/Auth';
import Contact from './components/contact/Contact';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Room from './components/room/Room';
import NewRoom from './components/newRoom/NewRoom';


export default (
  <Switch>
    <Route exact path='/' component={Auth} />
    <Route path='/Dash' component={Dashboard} />
    <Route path='/Contact' component={Contact} />
    <Route path='/Profile' component={Profile} />
    <Route path='/Room/:id' component={Room} />
    <Route path='/NewRoom' component={NewRoom} />
  </Switch>
)