import react from 'react';
import { Link } from "react-router-dom";
import './Header.css'


const Header = (props) => {
  return (
    <div>
      <p>header</p>
      <div className='nav-links'>
        <Link to='/Dash' >Dashboard</Link>
        <Link to='/Chat' >Chat</Link>
        <Link to='/Contact' >Contact</Link>
        <Link to='/Profile' >Profile</Link>
        <Link to='/Room' >Room</Link>
        <Link to='/Rooms' >Rooms</Link>
      </div>
    </div>
  )
}

export default Header;