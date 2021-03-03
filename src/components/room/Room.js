import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Spotify from 'spotify-web-api-js';
import Player from '../player/Player';
import Playlist from '../playlist/playlist'
import Header from '../header/Header'
import axios from 'axios'
import Chat from '../chat/Chat'


const s = new Spotify();

const Room = (props) => {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  // const [desktopDjPL, setDesktopDjPL] = useState(null);
  const [roomInfo, setRoomInfo] = useState({});
  const [isRoomAdmin, setIsRoomAdmin] = useState(false);
  const { user_id, playlist_uri, display_name } = props.localUser;
  const { id: room_id } = props.match.params;
  const { accessToken, user, localUser } = props;
  const [queue, setQueue] = useState([]);
  const [email, setEmail] = useState('');
  const [roomUrl, setRoomUrl] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [initialTrUri, setInitialTrUri] = useState('');
  const [socket, setSocket] = useState(null)
  const { id } = useParams()

  const getUserPlaylists = () => {
    fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      headers: { Authorization: "Bearer " + accessToken },
    })
      .then((playList) => playList.json())
      .then((data) => {
        // console.log('playlist:', data)
        setUserPlaylists(data);
      });
  };

  const handleAddTrack = (trUri, trId, trName, artist, trImg) => {
    socket.emit('queue', {
      trUri,
      trId,
      trName,
      artist,
      trImg,
      username: display_name,
      roomId: room_id,
      queue
    })

    // if(!queue[0]) {
    //   setInitialTrUri(trUri)
    //   // setQueue([...queue , {trUri, trId,trName,artist,trImg}])
    //   // s.queue(trUri)
    //   socket.emit('queue', { 
    //     trUri, 
    //     trId, 
    //     trName, 
    //     artist, 
    //     trImg, 
    //     username: display_name, 
    //     roomId: room_id 
    //   })
    // } else {
    //   // setQueue([...queue , {trUri, trId,trName,artist,trImg}])
    //   // s.queue(trUri)
    //   socket.emit('queue', { 
    //     trUri, 
    //     trId, 
    //     trName, 
    //     artist, 
    //     trImg, 
    //     username: display_name, 
    //     roomId: room_id 
    //   })
    // }


    // fetch('https://api.spotify.com/v1/me/player/play', {
    //   headers: { Authorization: "Bearer " + accessToken },
    //   method: 'PUT',
    //   body: JSON.stringify({ uris: trUri })
    // })
    // .then(res => res.json())
    // .then(data => {
    //   console.log(data)
    // })
    // .catch(err => console.log('play error:', err))

    // fetch('https://api.spotify.com/v1/me/player', {
    //   headers: { Authorization: "Bearer " + accessToken },
    // })
    //   .then(device => device.json())
    //   .then(data => {
    //     console.log('playback data', data)
    //   })

    // s.getMyCurrentPlaybackState()
    // .then(data => {
    //     console.log('plybck state data', data.device);
    // })

    // if(queue.length === 1) {
    //   console.log('queue test', queue);
    //   setInitialTrUri(trUri);
    // }
    //     s.queue(trUri)
    //   }
  }

  const handleDeleteRoom = () => {
    axios.delete(`/api/room/${room_id}`)
      .then(() => {
        props.history.push('/Dash')
      })
      .catch(err => console.log(err))
  }

  // const sendMessage = e => {
  //   e.preventDefault()

  //   socket.emit('message', { socketUserId: user_id, username: display_name, message, roomId: id })
  //   setMessage('')    
  // }

  useEffect(() => {
    s.setAccessToken(accessToken)

    s.getMyCurrentPlaybackState()
      .then(data => {
        if (data) {
          console.log('plybck state data', data.device);
        }
      })

    axios.get(`/api/room/${room_id}`)
      .then((res) => {
        setRoomInfo(res.data)
        if (user_id === res.data.created_by) {
          setIsRoomAdmin(true)
        }
      })
      .catch(err => console.log(err));

    axios.post(`/api/joinroom/`, { room_id })
      .then()
      .catch((err) => console.log(err));

    setRoomUrl(`https://deskjockey.us/room/${room_id}`)
  }, [])

  useEffect(() => {
    if (!socket) {
      setSocket(io.connect(process.env.REACT_APP_SOCKET_ENDPOINT))
    } else {
      socket.on('user-joined', ({ username }) => {
        console.log(`${username} has joined the chat`)
      })
      socket.on('queue', ({ trUri, trId, trName, artist, trImg, username, queue }) => {
        setQueue(q => {
          return [...q, { trUri, trId, trName, artist, trImg, username }]
        })
        s.queue(trUri)
        console.log(`${trName} was added to the queue by ${username}`)
        console.log('queue length', queue.length)
        console.log('queue content', queue)
        if (queue.length === 0) {
          setInitialTrUri(trUri)
        }
      })
    }

    return () => {
      if (socket) { socket.disconnect() }
    }
  }, [socket])

  useEffect(() => {
    if (socket) { socket.emit('join-room', { roomId: id, username: display_name }) }
  }, [id, socket])

  useEffect(() => {
    if (localUser.hasOwnProperty('user_id')) {
      getUserPlaylists();
      // getDesktopDj();
    }

  }, [localUser])

  const sendInvite = () => {
    if (email === '') {
      alert("Please enter an email address!");
    } else {
      axios
        .post("/api/invite", { email, roomUrl })
        .then(() => {
          window.alert("Message Sent!");
          setEmail('');
        })
        .catch((err) => console.log(err));
    }
  };


  console.log(initialTrUri);
  return (
    <div>
      <input
        value={email}
        type="text"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={() => sendInvite()}>Send Invite</button>
      {console.log(props)}
      {accessToken ? (
        <>
          <Header />
          <section className='room-title'>
            <h1>{roomInfo.room_name}</h1>
            {isRoomAdmin ? <button onClick={handleDeleteRoom}>Delete Room</button> : null}
            {/* <button className='delete'>Delete Room</button> */}
          </section>
          <section className='room-main'>
            <section className='room-column outer'>
              <button onClick={() => setShowPlaylists(!showPlaylists)}>Show Playlists</button>
              {showPlaylists ? (
                <div className='room-item-list'>
                  {userPlaylists.items.map(playlist => (
                    <Playlist
                      key={playlist.id}
                      id={playlist.id}
                      name={playlist.name}
                      image={playlist.images[0]}
                      trackCount={playlist.tracks.total}
                      accessToken={accessToken}
                      addTrack={handleAddTrack}
                    />
                  ))}
                </div>
              ) : null}
            </section>
            <section className='room-column inner'>
              <section className='room-player'>
                <Player
                  queue={queue}
                  initialTrUri={initialTrUri} />
              </section>
              <Chat
                username={display_name}
                userId={user_id}
                socket={socket} />
            </section>
            <section className='room-column outer'>
              <h3>QUEUE</h3>
              {queue[0] ? (queue.map(tracks => (
                <div key={tracks.trId} className='temp_name'>
                  <img src={tracks.trImg} height='40' />
                  <section>
                    <h5>{tracks.trName}</h5>
                    <h6>{tracks.artist}</h6>
                  </section>
                </div>


              ))) : null}
            </section>
          </section>
        </>
      ) : props.history.push('/')
      }
    </div >
  )
}

const mapStateToProps = (reduxState) => {
  return {
    user: reduxState.userReducer.user,
    accessToken: reduxState.userReducer.accessToken,
    localUser: reduxState.userReducer.localUser
  };
};




export default connect(mapStateToProps)(Room);