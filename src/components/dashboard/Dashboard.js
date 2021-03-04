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
import NewRoom from "../newRoom/NewRoom";
import Loading from '../Loading/Loading';

const Dashboard = (props) => {
  const { accessToken, localUser } = props;
  const [roomView, setRoomView] = useState("allrooms");
  const [publicRooms, setPublicRooms] = useState([]);
  const [privateRooms, setPrivateRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    axios
      .get(`/api/myrooms/${localUser.user_id}`)
      .then((res) => {
        setMyRooms(res.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }, [localUser])

  return (
    <div className='dash-container'>
      { isCreating ? (
        <NewRoom
          setIsCreating={setIsCreating}
          setIsLoading={setIsLoading} />
      )
        : null
      }
      {/* { isLoading ? <Loading /> : null} */}
      <Header setIsCreating={setIsCreating} />
      <nav>
        <span className={ roomView === 'allrooms' ? 'highlight' : null } onClick={() => setRoomView("allrooms")}>All Rooms</span>
        <span className={ roomView === 'myrooms' ? 'highlight' : null } onClick={() => setRoomView("myrooms")}>My Rooms</span>
        <span className={ roomView === 'privaterooms' ? 'highlight' : null } onClick={() => setRoomView("privaterooms")}>Private Rooms</span>
      </nav>
      {accessToken ? (
        <div className="map-container">
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
          <div className="empty-container"></div>
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
