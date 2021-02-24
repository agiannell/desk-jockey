import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import Player from '../player/Player';
import Playlist from '../playlist/playlist'
import Header from '../header/Header'
import { get } from 'request';

const Room = (props) => {
  const { accessToken, user } = props;
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [desktopDjPL, setDesktopDjPL] = useState([]);
  const { playlist_uri } = props.localUser

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
      if(user.hasOwnProperty('id')) {
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
    
    console.log('dj songs', desktopDjPL)
    console.log(desktopDjPL)
    return (
      <div>
      <Header />
      <button onClick={() => setShowPlaylists(!showPlaylists)}>Playlists</button>
      {showPlaylists ? (
        <div>
          {userPlaylists.items.map(playlist => (
            <Playlist
              id={playlist.id}
              name={playlist.name}
              accessToken={accessToken}
              addTrack={handleAddTrack}
            />
          ))}
        </div>
      ) : null}
      { desktopDjPL[0] ? (
        <section>
          <Player desktopDjPL={ desktopDjPL } />
        </section>
      ) : null }
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




export default connect(mapStateToProps)(Room);