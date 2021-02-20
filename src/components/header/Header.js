import react from 'react';
import { Link } from "react-router-dom";
import './Header.css'
import { connect } from 'react-redux'
import axios from 'axios';
import profile from '../profile/defaultprofile.webp'


const Header = (props) => {

  const { localUser } = props

  console.log(props)
  return (
    <div>
      <p>header</p>
      {localUser ? (
        <div className='nav-links'>
          <Link to='/Dash' >Dashboard</Link>
          <Link to='/Chat' >Chat</Link>
          <Link to='/Contact' >Contact</Link>
          <Link to='/Room' >Room</Link>
          <Link to='/Rooms' >Rooms</Link>
          <Link to='/Profile' >
            <div className='profile'>
              <img className='profile-pic' src={`${localUser.profile_pic}`} alt='profile' />
              <h6>{localUser.display_name}</h6>
            </div>
          </Link>

        </div>
      ) : null}

    </div>
  )
}

const mapStateToProps = (reduxState) => {
  return {
    user: reduxState.userReducer.user,
    accessToken: reduxState.userReducer.accessToken,
    localUser: reduxState.userReducer.localUser
  };
};

export default connect(mapStateToProps, {})(Header);