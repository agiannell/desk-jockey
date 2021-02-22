// import react from 'react';
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Rooms from "../rooms/Rooms";
import { setUser, setUserPlaylists, setAccessToken, setLocalUser } from "../../ducks/reducer/userReducer";
import axios from "axios";
import Header from '../header/Header'

const Dashboard = (props) => {
  const { setUser, setUserPlaylists, setAccessToken, setLocalUser } = props;
  const { user, accessToken } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicRooms, setPublicRooms] = useState([]);

  useEffect(() => {
    axios.get("/pizza").then((res) => {
      setAccessToken(res.data);
      setIsLoggedIn(true);
    });

    axios.get('/api/rooms')
      .then(res => {
        setPublicRooms(res.data)
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + accessToken },
      })
        .then((results) => results.json())
        .then((data) => {
          setUser(data);
          axios.get(`/api/check-user/${data.email}`).then((foundUser) => {
            // console.log(foundUser.data)
            if (foundUser.data) {
              return setLocalUser(foundUser.data)
            }

            axios
              .post("/api/user", {
                displayName: data.display_name,
                email: data.email,
                // profilePic: data.images[0].url,
              })
              .then()
              .catch((err) => console.log(err));
          });
        });
    }
  }, [accessToken]);

  const handleSession = () => {
    axios.get("/pizza").then((res) => console.log(res.data));
  };

  console.log('props:', props)
  return (
    <div>
      <Header />
      <div>Dashboard</div>
      <button onClick={handleSession}>Hit Me</button>
      {accessToken ? (
        <div>
          <h3>NAV-BAR</h3>
          <section className="rooms-map">
            {publicRooms.map(e => (
              <Rooms
                key={e.room_id}
                roomId={e.room_id}
                name={e.room_name}
                roomPic={e.room_pic} />
            ))}
          </section>
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (reduxState) => {
  return {
    user: reduxState.userReducer.user,
    accessToken: reduxState.userReducer.accessToken,
  };
};

export default connect(mapStateToProps, {
  setUser,
  setUserPlaylists,
  setAccessToken,
  setLocalUser
})(Dashboard);
