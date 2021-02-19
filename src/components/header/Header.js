import react from 'react';
import { Link } from "react-router-dom";
import './Header.css'
import { connect } from 'react-redux'
import axios from 'axios';
import profile from '../profile/defaultprofile.webp'


const Header = (props) => {

  const { user } = props
  const { display_name } = user
  const { url } = user.images[0]

  console.log(props.user)
  return (
    <div>
      <p>header</p>
      {user ? (
        <div className='nav-links'>
          <Link to='/Dash' >Dashboard</Link>
          <Link to='/Chat' >Chat</Link>
          <Link to='/Contact' >Contact</Link>
          <Link to='/Profile' >Profile</Link>
          <Link to='/Room' >Room</Link>
          <Link to='/Rooms' >Rooms</Link>
          <div className='profile'>
            <img className='profile-pic' src={profile} alt='profile' />
            <h6>{display_name}</h6>
          </div>
        </div>
      ) : null}

    </div>
  )
}

const mapStateToProps = (reduxState) => {
  return {
    user: reduxState.userReducer.user,
    accessToken: reduxState.userReducer.accessToken
  };
};

export default connect(mapStateToProps, {})(Header);