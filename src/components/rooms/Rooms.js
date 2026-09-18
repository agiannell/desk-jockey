import { useState } from 'react'
import { Link } from 'react-router-dom';
import deskJockeyIcon from '../../assets/img/logos/icon-white.svg'

const Rooms = (props) => {
  const { roomId, name, roomPic } = props
  const [imgSrc, setImgSrc] = useState(roomPic || deskJockeyIcon)

  return (
    <div>
      <Link to={`/room/${roomId}`}>
        <div className='room'>
          <h1>{name}</h1>
          <img
            src={imgSrc}
            alt={name}
            onError={() => setImgSrc(deskJockeyIcon)}
          />
        </div>
      </Link>
    </div>
  )
}

export default Rooms;