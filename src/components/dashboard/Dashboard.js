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
  const [roomView, setRoomView] = useState("allrooms");
  const [publicRooms, setPublicRooms] = useState([]);
  const [privateRooms, setPrivateRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);

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

    axios
      .get("/api/privaterooms")
      .then((res) => {
        setPrivateRooms(res.data);
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
                description:
                  "This is the playlist where the songs you're listening to with friends will show up. Don't delete this playlist or we will have to make a new one for you to listen through!",
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

useEffect(() => {
  axios
  .get(`/api/myrooms/${props.localUser.user_id}`)
  .then((res) => {
    setMyRooms(res.data);
  })
  .catch((err) => console.log(err));
}, [props.localUser])

  console.log(props.localUser.user_id);
console.log(myRooms);
  return (
    <div>
      <Header />
      <nav>
        <button onClick={() => setRoomView("allrooms")}>All Rooms</button>
        <button onClick={() => setRoomView("myrooms")}>My Rooms</button>
        <button onClick={() => setRoomView("privaterooms")}>Private Rooms</button>
      </nav>
      {/* <div>Dashboard</div> */}
      {/* <button onClick={testApi}>Hit Me</button> */}
      {accessToken ? (
        <div>
          <section className="rooms-map">
            {roomView === "allrooms" ? (
              <>
                {publicRooms.map((e) => (
                  <Rooms
                    key={e.room_id}
                    roomId={e.room_id}
                    name={e.room_name}
                    roomPic={e.room_pic}
                  />
                ))}
              </>
            ) : roomView === "myrooms" ? (
              <>
                {myRooms.map((e) => (
                  <Rooms
                    key={e.room_id}
                    roomId={e.room_id}
                    name={e.room_name}
                    roomPic={e.room_pic}
                  />
                ))}
              </>
            ) : roomView === "privaterooms" ? (
              <>
                {privateRooms.map((e) => (
                  <Rooms
                    key={e.room_id}
                    roomId={e.room_id}
                    name={e.room_name}
                    roomPic={e.room_pic}
                  />
                ))}
              </>
            ) : null}
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
    localUser: reduxState.userReducer.localUser
  };
};

export default connect(mapStateToProps, {
  setUser,
  setAccessToken,
  setLocalUser,
})(Dashboard);
