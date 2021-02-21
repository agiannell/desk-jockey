import react from 'react';
import { Link, withRouter } from "react-router-dom";
import './Header.css'
import { connect } from 'react-redux'
import { clearUser, clearLocalUser, clearAccessToken } from '../../ducks/reducer/userReducer';
import axios from 'axios';
import profile from '../profile/defaultprofile.webp'


const Header = (props) => {
  const { localUser, clearUser, clearLocalUser } = props

  const handleLogout = () => {
    const url = 'https://www.spotify.com/logout'                                                                   
    const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')
    setTimeout(() => spotifyLogoutWindow.close(), 2000)
    axios.get('/api/logout')
      .then(() => {
        clearLocalUser()
        clearUser()
        clearAccessToken()
      })
      .catch(err => console.log(err));

    props.history.push('/')
  }

  console.log(localUser)
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
          <button onClick={handleLogout}>Logout</button>

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

export default withRouter(connect(mapStateToProps, { clearUser, clearLocalUser })(Header));