import { useEffect, useState } from 'react';
import { connect} from "react-redux";
import SpotifyPlayer from 'react-spotify-web-playback';
import Playlist from '../playlist/playlist'

const Room = (props) => {
  const {accessToken,  user} = props;
  const [userPlaylists,setUserPlaylists] = useState([]);
  const [showPlaylists,setShowPlaylists] = useState(false);
  const [roomQueue,setRoomQueue] = useState([])

  useEffect(() => {
    fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
    headers: { Authorization: "Bearer " + accessToken },
  })
    .then((playList) => playList.json())
    .then((data) => {
      setUserPlaylists(data);
      console.log(userPlaylists);
    });
  },[])
  console.log(user)

  const handleAddTrack = (uri) => {
      setRoomQueue(...roomQueue,uri)
  }

  return (
    <div>
      <button onClick={() => setShowPlaylists(!showPlaylists)}>Playlists</button>
      {showPlaylists ? (
        <div>
          {userPlaylists.items.map(playlist => (
            <Playlist 
            id={playlist.id}
            name={playlist.name}
            accessToken={accessToken}
             />
          ))}
        </div>
      ): null}
      <section>
        <SpotifyPlayer
          token={accessToken}
          uris={['spotify:playlist:5f03s8ZslD2guGAXaPNCSg']}
          />
      </section>
    </div>
  )
}

const mapStateToProps = (reduxState) => {
  return {
    user: reduxState.userReducer.user,
    accessToken: reduxState.userReducer.accessToken,
  };
};


export default connect(mapStateToProps)(Room);