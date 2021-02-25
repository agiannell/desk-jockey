import axios from 'axios'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import Header from '../header/Header'

const NewRoom = (props) => {
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [pic, setPic] = useState('')
  const [isPrivate, setIsPrivate] = useState('')
  const [isCollaborative, setIsCollaborative] = useState('')
  const [genre, setGenre] = useState('')
  const [createdBy, setCreatedBy] = useState('')

  useEffect(() => {
    setCreatedBy(props.localUser.user_id)
  }, [])

  const handleCreateRoom = () => {
    axios.post('/api/room', {
      roomName, password, pic, isPrivate, isCollaborative, genre, createdBy
    }).then(() => {

      props.history.push('/Dash')
    })
  }

  console.log(props)
  return (
    <div>
      <Header />
      <input placeholder="Room Name" name='roomName' value={roomName} onChange={e => setRoomName(e.target.value)} />
      <form>
        <input type="radio" id="public" name="room type" value="False" onChange={e => setIsPrivate(e.target.value)} />
        <label for="public">Public</label><br />
        <input type="radio" id="private" name="room type" value="True" onChange={e => setIsPrivate(e.target.value)} />
        <label for="private">Private</label><br />
      </form>
      <input placeholder='Password for private Room' value={password} onChange={e => setPassword(e.target.value)} />
      <input placeholder='Room Image Url' value={pic} onChange={e => setPic(e.target.value)} />
      <form>
        <input type="radio" id="collaborative" name="room type" value="True" onChange={e => setIsCollaborative(e.target.value)} />
        <label for="collaborative">Collaborative</label><br />
        <input type="radio" id="exclusive" name="room type" value="False" onChange={e => setIsCollaborative(e.target.value)} />
        <label for="exclusive">Non-Collaborative</label><br />
      </form>
      <input placeholder="genre" value={genre} onChange={e => setGenre(e.target.value)} />

      <p>Invite your friends to listen!</p>
      <input placeholder='Enter email address' />
      <button>Add</button>
      <button onClick={() => handleCreateRoom()}>Create Room</button>
    </div>
  )
}


const mapStateToProps = (reduxState) => {
  return {
    localUser: reduxState.userReducer.localUser
  };
};

export default connect(mapStateToProps, {})(NewRoom)