import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import Player from '../player/Player';
import Playlist from '../playlist/playlist'
import Header from '../header/Header'
import axios from 'axios'

const Room = (props) => {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [desktopDjPL, setDesktopDjPL] = useState([]);
  const [roomInfo, setRoomInfo] = useState({});
  const [isRoomAdmin, setIsRoomAdmin] = useState(false);
  const { user_id, playlist_uri } = props.localUser;
  const { id: room_id } = props.match.params;
  const { accessToken, user } = props;

  useEffect(() => {
    axios.get(`/api/room/${room_id}`)
      .then((res) => {
        setRoomInfo(res.data)
        if (user_id === res.data.created_by) {
          setIsRoomAdmin(true)
        }
      })
  }, [])

  const getUserPlaylists = () => {
    fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((playList) => playList.json())
      .then((data) => {
        // console.log(data)
        setUserPlaylists(data);
        // console.log(userPlaylists);
      });
  };

  const getDesktopDj = () => {
    let djPlaylistId = playlist_uri.substr(17,)
    fetch(`https://api.spotify.com/v1/playlists/${djPlaylistId}/tracks`, {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((tracks) => tracks.json())
      .then((data) => {
        // console.log(data)
        // data.items.map(e => {
        //   return setDesktopDjPL(uri => [...desktopDjPL, e.track.uri])
        // })
        setDesktopDjPL(data.items)
      });
  }

  useEffect(() => {
    if (user.hasOwnProperty('id')) {
      getUserPlaylists();
      getDesktopDj();
    }

  }, [user])

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

  console.log('user playlists:', userPlaylists);
  console.log('room info:', roomInfo);
  // console.log('dj songs', desktopDjPL)
  // console.log(desktopDjPL)
  return (
    <div>
      <Header />
      <section className='room-title'>
        <h1>{ roomInfo.room_name }</h1>
        {isRoomAdmin ? <button>Delete Room</button> : null}
        {/* <button className='delete'>Delete Room</button> */}
      </section>
      <section className='room-main'>
        <section className='room-column outer'>
          <button onClick={() => setShowPlaylists(!showPlaylists)}>Show Playlists</button>
          {showPlaylists ? (
            <div className='room-item-list'>
              {userPlaylists.items.map(playlist => (
                <Playlist
                key={ playlist.id }
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
          { desktopDjPL[0] ? (
            <section className='room-player'>
              <Player desktopDjPL={desktopDjPL} />
            </section>
          ) : null}
        </section>
        <section className='room-column outer'>
        </section>
      </section>
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