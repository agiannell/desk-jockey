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
// import { setRoomUsers } from '../../ducks/reducer/userReducer';

const s = new Spotify();

const Room = (props) => {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [roomInfo, setRoomInfo] = useState({});
  const [isRoomAdmin, setIsRoomAdmin] = useState(false);
  const { user_id, display_name } = props.localUser;
  const { id: room_id } = props.match.params;
  const { accessToken, user, localUser, roomUsers } = props;
  const [queue, setQueue] = useState([]);
  const [email, setEmail] = useState('');
  const [roomUrl, setRoomUrl] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [initialTrUri, setInitialTrUri] = useState('');
  const [socket, setSocket] = useState(null)
  const { id } = useParams()
  const [roomUsers, setRoomUsers] = useState([]);

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
  }

  const handleDeleteRoom = () => {
    axios.delete(`/api/room/${room_id}`)
      .then(() => {
        props.history.push('/Dash')
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    s.setAccessToken(accessToken)

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
      socket.on('user-joined', ({ username, accessToken, roomUsers }) => {
        console.log(`${username} has joined the chat`)
        setRoomUsers(r => {
          return [...r, { username, accessToken }]
        })
        console.log('Room Users:', roomUsers)
        // setQueue(q => [...q, queue])
      })
      socket.on('queue', ({ trUri, trId, trName, artist, trImg, username, queue }) => {
        setQueue(q => {
          return [...q, { trUri, trId, trName, artist, trImg, username }]
        })
        s.queue(trUri)
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
    if (socket) { socket.emit('join-room', { roomId: id, username: display_name, accessToken, roomUsers }) }
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

  const getInfo = () => {
    s.getMyCurrentPlaybackState()
      .then(data => {
        console.log(data)
        socket.emit('playback-info', { progress: data.progress_ms, trUri: data.item.uri })
      })
  }

  return (
    <div>
      {accessToken ? (
        <>
          <Header />
          <section className='room-title'>
            <section className='room-invite'>
              <input
                placeholder='Invite a Friend'
                value={email}
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={() => sendInvite()}>Send Invite</button>
            </section>
            <h1>{roomInfo.room_name}</h1>
            {isRoomAdmin ? <button onClick={handleDeleteRoom}>Delete Room</button> : null}
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
                <button onClick={ getInfo }>Get Info</button>
                <Player
                  queue={queue}
                  initialTrUri={initialTrUri}
                  socket={ socket } />
              </section>
              <Chat
                username={display_name}
                userId={user_id}
                socket={socket} />
            </section>
            <section className='room-column outer'>
              <h3>QUEUE</h3>
              <section className='room-item-list'>
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
    localUser: reduxState.userReducer.localUser,
    // roomUsers: reduxState.userReducer.roomUsers
  };
};

export default connect(mapStateToProps)(Room);