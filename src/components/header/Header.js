import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import {
  clearUser,
  clearLocalUser,
  clearAccessToken,
  setAccessToken,
  setLocalUser,
  setUser
} from '../../ducks/reducer/userReducer';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';
import Avatar from '../avatar/Avatar';

const s = new Spotify();

const Header = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    localUser,
    clearUser,
    clearLocalUser,
    clearAccessToken,
    setLocalUser,
    setAccessToken,
    accessToken,
    setUser,
    setIsCreating
  } = props;

  useEffect(() => {
    axios.get("/pizza")
      .then((res) => {
        setAccessToken(res.data.token);
        s.setAccessToken(res.data.token);
      })
      .catch((err) => console.log(err));
  }, [setAccessToken])

  useEffect(() => {
    if (accessToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + accessToken },
      })
        .then((results) => results.json())
        .then((data) => {
          setUser(data);
          const spotifyProfilePic = data.images?.[0]?.url;

          axios.get(`/api/check-user/${data.email}`).then((foundUser) => {
            if (foundUser.data) {
              if (spotifyProfilePic && spotifyProfilePic !== foundUser.data.profile_pic) {
                axios
                  .patch(`/api/user/${foundUser.data.user_id}/profile-pic`, {
                    profilePic: spotifyProfilePic
                  })
                  .then((updated) => setLocalUser(updated.data))
                  .catch((err) => console.log(err));
              } else {
                setLocalUser(foundUser.data);
              }
              return;
            }

            axios
              .post("/api/user", {
                displayName: data.display_name,
                email: data.email,
                profilePic: spotifyProfilePic,
              })
              .then((response) => {
                setLocalUser(response.data);
              })
              .catch((err) => console.log(err));
          });
        });
    }
  }, [accessToken, setLocalUser, setUser]);

  useEffect(() => {
    axios.get('/api/user')
      .then(res => {
        // console.log('session user', res.data)
        setLocalUser(res.data);
      }).catch(err => console.log(err));
  }, [setLocalUser])

  const handleLogout = () => {
    clearAccessToken()
    clearLocalUser()
    clearUser()
    const url = 'https://www.spotify.com/logout'
    const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')
    setTimeout(() => spotifyLogoutWindow.close(), 1000)
    axios.get('/api/logout')
      .then(() => {
        navigate('/')
      })
      .catch(err => console.log(err));
  }

  // console.log('accessToken:', accessToken)
  // console.log('header-props:', props)
  return (
    <div className='header-container'>
      {localUser.user_id ? (
        <div className='nav-links'>
          { location.pathname === '/Dash' ? <button onClick={() => setIsCreating(true)}>+ Create Room</button> : null}
          { location.pathname !== '/Dash' ? <Link to='/Dash' >Dashboard</Link> : null}
          { location.pathname !== '/Contact' ? <Link to='/Contact' >Contact</Link> : null}
          <Link to='/Profile' >
            <div className='profile'>
              <Avatar className='profile-pic' src={localUser?.profile_pic} displayName={localUser?.display_name} />
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

export default connect(mapStateToProps, {
  clearUser,
  clearLocalUser,
  clearAccessToken,
  setAccessToken,
  setLocalUser,
  setUser
})(Header);