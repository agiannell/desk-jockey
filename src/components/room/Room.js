import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import Player from '../player/Player';
import Playlist from '../playlist/playlist'
import Header from '../header/Header'
import axios from 'axios'
import Chat from '../chat/Chat'

const Room = (props) => {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [desktopDjPL, setDesktopDjPL] = useState(null);
  const [roomInfo, setRoomInfo] = useState({});
  const [isRoomAdmin, setIsRoomAdmin] = useState(false);
  const { user_id, playlist_uri, display_name } = props.localUser;
  const { id: room_id } = props.match.params;
  const { accessToken, user, localUser } = props;

  const getDesktopDj = () => {
    let djPlaylistId = playlist_uri.substr(17,)
    fetch(`https://api.spotify.com/v1/playlists/${djPlaylistId}/tracks`, {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((tracks) => tracks.json())
      .then((data) => {
        // data.items.map(e => {
        //   return setDesktopDjPL(uri => [...desktopDjPL, e.track.uri])
        // })
        console.log('dj pl data:', data.items)
        setDesktopDjPL(data.items)
      });
  };

  const getUserPlaylists = () => {
    fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((playList) => playList.json())
      .then((data) => {
        setUserPlaylists(data);
      });
  };

  useEffect(() => {
    axios.get(`/api/room/${room_id}`)
      .then((res) => {
        setRoomInfo(res.data)
        if (user_id === res.data.created_by) {
          setIsRoomAdmin(true)
        }
      })
      .catch(err => console.log(err));

    axios.post(`/api/joinroom/`, {room_id})
      .then()
      .catch((err) => console.log(err));
  }, [])

  const handleDeleteRoom = () => {
    axios.delete(`/api/room/${room_id}`)
      .then(() => {
        props.history.push('/Dash')
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (localUser.hasOwnProperty('user_id')) {
      getUserPlaylists();
      getDesktopDj();
    }  

  }, [localUser])

  const handleAddTrack = (uri, trId) => {
    let djPlaylistId = playlist_uri.substr(17,)
    fetch(`https://api.spotify.com/v1/playlists/${djPlaylistId}/tracks`, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        "uris": [uri]
      }),
      scope: "playlist-modify-public playlist-modify-private"
    })
      .then(() => {
        getDesktopDj()
        // console.log('hit')
        // fetch(`https://api.spotify.com/v1/tracks/${trId}`, {
        //   headers: {
        //     Authorization: 'Bearer ' + accessToken
        //   }
        // })
        // .then(track => track.json())
        // .then(data => {
        //   console.log('add track data', data)
        //   setDesktopDjPL((uri) =>[...desktopDjPL,{track: {
        //     uri: data.uri
        //   }}])
        // })
      })
      .catch(err => console.log(err))
  }
  console.log('dj state pl:', desktopDjPL)
  return (
    <div>
      {accessToken ? (
        <>
          <Header />
          <section className='room-title'>
            <h1>{roomInfo.room_name}</h1>
            {isRoomAdmin ? <button onClick={handleDeleteRoom}>Delete Room</button> : null}
            {/* <button className='delete'>Delete Room</button> */}
          </section>
          <section className='room-main'>
            <section className='room-column outer'>
              <button onClick={() => setShowPlaylists(!showPlaylists)}>Show Playlists</button>
              {showPlaylists ? (
                <div className='room-item-list'>
                  {userPlaylists.items.map(playlist => (
                    <Playlist
                      key={playlist.id}
                      id={playlist.id}
                      name={playlist.name}
                      image={playlist.images[0]}
                      trackCount={playlist.tracks.total}
                      accessToken={accessToken}
                      addTrack={handleAddTrack}
                    />
                  ))}
                </div>
              ) : null}
            </section>
            <section className='room-column inner'>
              {desktopDjPL ? (
                <section className='room-player'>
                  <Player desktopDjPL={desktopDjPL} />
                </section>
              ) : null}
              <Chat username={display_name} />
            </section>
            <section className='room-column outer'>
            </section>
          </section>
        </>
      ) : props.history.push('/')}
    </div >
  )
}

const mapStateToProps = (reduxState) => {
  return {
    user: reduxState.userReducer.user,
    accessToken: reduxState.userReducer.accessToken,
    localUser: reduxState.userReducer.localUser
  };
};




export default connect(mapStateToProps)(Room);