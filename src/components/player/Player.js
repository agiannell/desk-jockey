import SpotifyPlayer from "react-spotify-web-playback";
import { connect } from "react-redux";
import { useEffect } from "react";
var Spotify = require("spotify-web-api-js");
var s = new Spotify();

const Player = (props) => {
  const { accessToken, initialTrUri } = props;
  
  useEffect(() => {
    if (accessToken) {
      s.setAccessToken(accessToken)
    }
  }, [accessToken]);

  return (
    <section className='player-container'>
      <SpotifyPlayer
        // callback={state => {
        //   console.log(state);
        //   setProgress(state.progressMs)
        //   handleAudioSync(state.progressMs);
        // }}
        className="player"
        name="DeskJockey Player"
        token={accessToken}
        uris={initialTrUri}
        syncExternalDevice='true'
        persistDeviceSelection='true'
        // autoPlay={ false }
        initialVolume={0.5}
        styles={{
          bgColor: "#246A73",
          sliderColor: "#246A73",
          color: "#F3DFC1",
          trackNameColor: "#F3DFC1",
          loaderColor: "#246A73",
          activeColor: "red",
          sliderHandleColor: "#F3DFC1"
        }}
      />
    </section>
  );
};

const mapStateToProps = (reduxState) => ({
  accessToken: reduxState.userReducer.accessToken,
  user: reduxState.userReducer.user,
  localUser: reduxState.userReducer.localUser
});

export default connect(mapStateToProps)(Player);
