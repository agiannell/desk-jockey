import SpotifyPlayer from "react-spotify-web-playback";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
var Spotify = require("spotify-web-api-js");
var s = new Spotify();

const Player = (props) => {
  const { accessToken, desktopDjPL, playlistUri, getDesktopDjFn } = props;
  const [playerUri,setPlayerUri] = useState(playlistUri)

  useEffect(() => {}, []);

  return (
    <section>
      <SpotifyPlayer
        callback={(state) => {
          console.log(state);
          if (state.progressMs === state.track.durationMs || !state.isPlaying) {
            let djPlaylistId = playlistUri.substr(17,)
            fetch(`https://api.spotify.com/v1/playlists/${djPlaylistId}`, {
              headers: { Authorization: "Bearer " + accessToken },
            })
              .then((playList) => playList.json())
              .then((data) => {
                setPlayerUri(data.uri);
              });
          }
        }}
        className="player"
        name="Desktop DJ Player"
        token={accessToken}
        uris={playerUri}
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
