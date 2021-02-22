import { Link } from 'react-router-dom';

const Rooms = (props) => {
  const { roomId, name, roomPic } = props
  return (
    <div>
      <Link to={ `/room/${ roomId }` }>
        <div className='room'>
          <h1>{ name }</h1>
          <img src={ roomPic } alt={ name } />
        </div>
      </Link>
    </div>
  )
}

export default Rooms;