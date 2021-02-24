import axios from 'axios'

const NewRoom = (props) => {


  const handleCreateRoom = () => {
    axios.post('/api/room', {

    }).then()
  }

  return (
    <div>
      <input placeholder="Room Name" />
      <form>
        <input type="radio" id="public" name="room type" value="public" />
        <label for="public">Public</label><br />
        <input type="radio" id="private" name="room type" value="private" />
        <label for="private">Private</label><br />
      </form>
      <input placeholder="genre" />
      <p>Invite your friends to listen!</p>
      <input placeholder='Enter email address' />
      <button>Add</button>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  )
}

export default NewRoom