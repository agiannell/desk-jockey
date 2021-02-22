import {connect} from 'react-redux';
import SpotifyPlayer from 'react-spotify-web-playback';

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
    
  return (
    <div>
      <section>
        <SpotifyPlayer
          token={accessToken}
          // uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
          />;
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