import { useEffect } from 'react'
import { Link, withRouter } from "react-router-dom";
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

const s = new Spotify();

const Header = (props) => {
  const {
    localUser,
    clearUser,
    clearLocalUser,
    setLocalUser,
    setAccessToken,
    accessToken,
    setUser,
    setIsCreating
  } = props;

  useEffect(() => {
    axios.get("/pizza")
      .then((res) => {
        // console.log('axios-token', res.data);
        setAccessToken(res.data);
        s.setAccessToken(res.data);
      });
  }, [])

  useEffect(() => {
    if (accessToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + accessToken },
      })
        .then((results) => results.json())
        .then((data) => {
          // console.log('axios-spotify-user', data)
          setUser(data);
          axios.get(`/api/check-user/${data.email}`).then((foundUser) => {
            // console.log(foundUser.data);
            if (foundUser.data) {
              // console.log('axios-session-user', foundUser.data)
              return setLocalUser(foundUser.data);
            }
            fetch(`https://api.spotify.com/v1/users/${data.id}/playlists`, {
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                name: "Desktop-Dj",
                description:
                  "This is the playlist where the songs you're listening to with friends will show up. Don't delete this playlist or we will have to make a new one for you to listen through!",
                public: false,
              }),
              scope: "playlist-modify-public playlist-modify-private",
            })
              .then((res) => res.json())
              .then((info) => {
                // console.log(info);
                axios
                  .post("/api/user", {
                    displayName: data.display_name,
                    email: data.email,
                    profilePic: data.images[0].url,
                    playlist_uri: info.uri,
                  })
                  .then((response) => {
                    setLocalUser(response.data);
                  })
                  .catch((err) => console.log(err));
              });
          });
        });
    }
  }, [accessToken]);

  useEffect(() => {
    axios.get('/api/user')
      .then(res => {
        // console.log('session user', res.data)
        setLocalUser(res.data);
      }).catch(err => console.log(err));
  }, [])

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

  // console.log('accessToken:', accessToken)
  console.log('header-props:', props)
  return (
    <div className='header-container'>
      {localUser ? (
        <div className='nav-links'>
          { props.location.pathname === '/Dash' ? <button onClick={() => setIsCreating(true)}>+ Create Room</button> : null }
          { props.location.pathname !== '/Dash' ? <Link to='/Dash' >Dashboard</Link> : null }
          { props.location.pathname !== '/Contact' ? <Link to='/Contact' >Contact</Link> : null }
          <Link to='/Profile' >
            <div className='profile'>
              <img className='profile-pic' src={`${localUser?.profile_pic}`} alt='profile' />
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

export default withRouter(connect(mapStateToProps, {
  clearUser,
  clearLocalUser,
  clearAccessToken,
  setAccessToken,
  setLocalUser,
  setUser
})(Header));