import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import SpotifyPlayer from 'react-spotify-web-playback';
import Playlist from '../playlist/playlist'
import Header from '../header/Header'

const Room = (props) => {
  const { accessToken, user } = props;
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const { playlist_uri } = props.localUser

  useEffect(() => {
    fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((playList) => playList.json())
      .then((data) => {
        setUserPlaylists(data);
        // console.log(userPlaylists);
      });
  }, [])


  const handleAddTrack = (uri) => {
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
    console.log('hit')
  }

  return (
    <div>
      <Header />
      <button onClick={handleAddTrack} >Hit Me</button>
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
      <section>
        <SpotifyPlayer
          className='player'
          token={accessToken}
          uris={playlist_uri}
          styles={{
            bgColor: '#160F29',
            sliderColor: '#246A73',
            color: '#F3DFC1',
            trackNameColor: '#F3DFC1',
            loaderColor: '#246A73',
            activeColor: 'red'
          }}
        />
      </section>
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