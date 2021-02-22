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
<<<<<<< HEAD
    <div className='page-parent'>
      <section className='player-section'>
=======
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
>>>>>>> d809af912fbbe1655983e63961138bb7573e7b30
        <SpotifyPlayer
          className='player'
          token={accessToken}
          uris={['spotify:playlist:5f03s8ZslD2guGAXaPNCSg']}
<<<<<<< HEAD
          styles={{
            bgColor: '#160F29',
            sliderColor: '#246A73',
            color: '#F3DFC1',
            trackNameColor: '#F3DFC1',
            loaderColor: '#246A73',
            activeColor: 'red'
          }}
=======
>>>>>>> d809af912fbbe1655983e63961138bb7573e7b30
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