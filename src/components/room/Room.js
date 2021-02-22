import { useEffect } from 'react';
import {connect} from 'react-redux';
import SpotifyPlayer from 'react-spotify-web-playback';
import {setUserPlaylists} from '../../ducks/reducer/userReducer';

const Room = (props) => {
  const {accessToken, setUserPlaylists, user} = props;
useEffect(() => {
  fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
    headers: { Authorization: "Bearer " + accessToken },
  })
    .then((playList) => playList.json())
    .then((data) => {
      console.log(user.id)
      setUserPlaylists(data);
      console.log(data);
    });
}, []); 

  return (
    <div>
      <section>
        <SpotifyPlayer
          token={accessToken}
          uris={['spotify:playlist:5f03s8ZslD2guGAXaPNCSg']}
          />;
      </section>
    </div>
  )
}

const mapStateToProps = (reduxState) => {
  return {
    accessToken: reduxState.userReducer.accessToken,
    userPlaylists: reduxState.userReducer.userPlaylists,
    user: reduxState.userReducer.user
  };
};

export default connect(mapStateToProps, {setUserPlaylists})(Room);