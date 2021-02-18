// import react from 'react';
import { useState, useEffect } from "react";
import queryString from "query-string";
import { connect } from "react-redux";
import { setUser, setUserPlaylists } from "../../ducks/reducer/userReducer";

const Dashboard = (props) => {
  const { setUser, setUserPlaylists } = props;
  const { user } = props;
  console.log(props);
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    console.log(window.location);

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setIsLoggedIn(true)
      });

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserPlaylists(data);
        console.log(data);
      });
  }, []);

 

  return (
    <div>
      <div>Dashboard</div>
      {isLoggedIn 
      ? <div>
          <p> Hi {user?.display_name}!</p>
          <img src={user?.images[0].url} />
        </div>
      : null}
    </div>
  )
}

const mapStateToProps = (reduxState) => {
  return {
    user: reduxState.userReducer.user,
  };
};

export default connect(mapStateToProps, { setUser, setUserPlaylists })(Dashboard);