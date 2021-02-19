// import react from 'react';
import { useState, useEffect } from "react";
import queryString from "query-string";
import { connect } from "react-redux";
import Rooms from "../rooms/Rooms"
import { setUser, setUserPlaylists, setAccessToken } from "../../ducks/reducer/userReducer";
import axios from "axios";

const Dashboard = (props) => {
  const { setUser, setUserPlaylists, setAccessToken } = props;
  const { user, accessToken } = props;
  // console.log(props);
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {

    axios.get('/pizza')
      .then((res) => {
        // console.log(res.data)
        setAccessToken(res.data)
        setIsLoggedIn(true)
      })

  }, [])

  // console.log(accessToken)

  useEffect(() => {

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);

      });

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserPlaylists(data);
        // console.log(data);
      });
    ;
  }, [isLoggedIn])

  const handleSession = () => {
    axios.get('/pizza')
      .then(res => console.log(res.data))
  }

  console.log('props:', props)
  return (
    <div>
      <div>Dashboard</div>
      <button onClick={handleSession} >Hit Me</button>
      {isLoggedIn ?
        (<div>
          <p> Hi {user?.display_name}!</p>
          <img src={user?.images[0].url} />
          <div></div>
        </div>) : null
      }
      <Rooms />
    </div>
  )
}

const mapStateToProps = (reduxState) => {
  return {
    user: reduxState.userReducer.user,
    accessToken: reduxState.userReducer.accessToken
  };
};

export default connect(mapStateToProps, { setUser, setUserPlaylists, setAccessToken })(Dashboard);