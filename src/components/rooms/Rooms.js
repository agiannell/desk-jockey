
const Rooms = (props) => {
  const { roomId, name, roomPic } = props
  return (
    <div>
      <h1>{ name }</h1>
      <img src={ roomPic } alt={ name } />
    </div>
  )
}

export default Rooms;