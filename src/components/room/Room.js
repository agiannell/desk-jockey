import {connect} from 'react-redux';
import { setUser, setUserPlaylists, setAccessToken } from "../../ducks/reducer/userReducer";
import Spotify from 'node-spotify-api';

const Room = (props) => {
  const {accessToken} = props;

      
  // fetch("https://api.spotify.com/v1/me/playlists", {
  //   headers: { Authorization: "Bearer " + accessToken },
  // })
  //   .then((playList) => playList.json())
  //   .then((data) => {
  //     setUserPlaylists(data);
  //     // console.log(data);
  //   });


  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = props.accessToken;
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });
    
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });
  
    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    // Connect to the player!
    player.connect();
    };
    
  return (
    <div>
      <section>
        <script src="https://sdk.scdn.co/spotify-player.js"></script>
      </section>
    </div>
  )
}

const mapStateToProps = (reduxState) => {
  return {
    accessToken: reduxState.userReducer.accessToken,
  };
};

export default connect(mapStateToProps)(Room);