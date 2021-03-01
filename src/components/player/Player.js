import SpotifyPlayer from "react-spotify-web-playback";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
var Spotify = require("spotify-web-api-js");
var s = new Spotify();

const Player = (props) => {
  const { accessToken, queue } = props; 
  
  useEffect(() => {
    if (accessToken) {
      s.setAccessToken(accessToken)
    }
  }, [accessToken]);

  return (
    <section>
      <SpotifyPlayer
        className="player"
        name="Desktop DJ Player"
        token={accessToken}
        uris={queue.map(track => track.trUri )}
        styles={{
          bgColor: "#246A73",
          sliderColor: "#246A73",
          color: "#F3DFC1",
          trackNameColor: "#F3DFC1",
          loaderColor: "#246A73",
          activeColor: "red",
          sliderHandleColor: "#F3DFC1",
          sliderColor: "#F3DFC1",
        }}
      />
    </section>
  );
};

const mapStateToProps = (reduxState) => ({
  accessToken: reduxState.userReducer.accessToken,
});

export default connect(mapStateToProps)(Player);
