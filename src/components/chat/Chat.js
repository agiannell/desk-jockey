import { connect } from "react-redux";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Chat = (props) => {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const { id } = useParams()
  const [message, setMessage] = useState('')
  const { username } = props

  useEffect(() => {
    if (!socket) {
      setSocket(io.connect('http://localhost:4000'))
    } else {
      socket.on('user-joined', ({ username }) => {
        console.log(`${username} has joined the chat`)
      })
      socket.on('message', ({ message, username }) => {
        setMessages((m) => {
          return [...m, { message: message, username: username }]
        })
      })
    }
    return () => {
      if (socket) { socket.disconnect() }
    }


  }, [socket])

  useEffect(() => {
    if (socket) { socket.emit('join-room', { roomId: id, username: username }) }

  }, [id, socket])


  return (
    <div>
      <div>
        {messages.map((el, id) => {
          return <p key={id}>{el.message} - {el.username}</p>
        })}
      </div>
      <form >
        <input onChange={(e) => setMessage(e.target.value)} value={message} />
        <button onClick={(e) => {
          e.preventDefault()
          socket.emit('message', { message, roomId: id, username })
          setMessage('')
        }}>Send</button>
      </form>
    </div>
  )
}


export default Chat;