import {useState, useEffect} from 'react';
import Tracks from '../tracks/tracks';

const Playlist = (props) => {
  const { name, id, accessToken } = props;
  const [tracks,setTracks] = useState([]);
  const [showTracks,setShowTracks] = useState(false);

  useEffect(() => {
    fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((tracks) => tracks.json())
      .then((data) => {
        setTracks(data)
        console.log(data)
      });
  },[]);

  return (
    <div>
      <h1 onClick={() => setShowTracks(!showTracks)}>{name}</h1>
      {showTracks ? (
          <div>
              {tracks.items.map(tracks => (
                  <Tracks 
                    trId={tracks.track.id}
                    trName={tracks.track.name}
                  />
              ))}
          </div>
      )

      :null}
    </div>
  );
};

export default Playlist;
