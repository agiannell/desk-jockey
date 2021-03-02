import { Link } from 'react-router-dom';

const Rooms = (props) => {
  const { roomId, name, roomPic } = props
  // console.log(roomId);
  return (
    <div>
      <Link to={`/room/${roomId}`}>
        <div className='room'>
          <h1>{name}</h1>
          <img src={roomPic} alt={name} height='200' width='200' />
        </div>
      </Link>
    </div>
  )
}

export default Rooms;