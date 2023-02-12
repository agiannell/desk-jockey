import { useState, useEffect } from 'react';
import Tracks from '../tracks/tracks';

const Playlist = (props) => {
  const { id, name, image, trackCount, accessToken } = props;
  const [tracks, setTracks] = useState([]);
  const [showTracks, setShowTracks] = useState(false);



  useEffect(() => {
    fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((tracks) => tracks.json())
      .then((data) => {
        setTracks(data.items)
        // console.log(data.items)
      });
  }, [accessToken, id]);

  return (
    <div>
      <section className='playlist-render' onClick={() => setShowTracks(!showTracks)}>
        <img src={image?.url} alt={name} />
        <section className='playlist-info'>
          <h3>{name}</h3>
          <p>{trackCount} tracks</p>
        </section>
      </section>
      {showTracks ? (
        <div>
          {tracks.map(tracks => (
            <Tracks
              trId={tracks.track.id}
              trName={tracks.track.name}
              addTrack={props.addTrack}
              trUri={tracks.track.uri}
              artist={tracks.track.artists[0].name}
              trImg={tracks.track.album.images[0].url}
            />
          ))}
        </div>
      )

        : null}
    </div>
  );
};

export default Playlist;
