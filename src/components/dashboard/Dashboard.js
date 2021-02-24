// import react from 'react';
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Rooms from "../rooms/Rooms";
import {
  setUser,
  setAccessToken,
  setLocalUser,
} from "../../ducks/reducer/userReducer";
import axios from "axios";
import Header from "../header/Header";

const Dashboard = (props) => {
  const { setUser, setAccessToken, setLocalUser } = props;
  const { user, accessToken } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicRooms, setPublicRooms] = useState([]);

  useEffect(() => {
    axios.get("/pizza").then((res) => {
      setAccessToken(res.data);
      setIsLoggedIn(true);
    });

    axios
      .get("/api/rooms")
      .then((res) => {
        setPublicRooms(res.data);
      })
      .catch((err) => console.log(err));
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
            // console.log(foundUser.data);
            if (foundUser.data) {
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
                description: "This is the playlist where the songs you're listening to with friends will show up. Don't delete this playlist or we will have to make a new one for you to listen through!",
                public: false,
              }),
              scope: "playlist-modify-public playlist-modify-private",
            })
              .then((res) => res.json())
              .then((info) => {
                console.log(info);
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

  return (
    <div>
      <Header />
      {/* <div>Dashboard</div> */}
      {/* <button onClick={testApi}>Hit Me</button> */}
      {accessToken ? (
        <div>
          <h3>NAV-BAR</h3>
          <section className="rooms-map">
            {publicRooms.map((e) => (
              <Rooms
                key={e.room_id}
                roomId={e.room_id}
                name={e.room_name}
                roomPic={e.room_pic}
              />
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
  setAccessToken,
  setLocalUser,
})(Dashboard);
