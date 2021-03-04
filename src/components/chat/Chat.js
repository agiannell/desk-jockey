import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RiSendPlaneFill } from 'react-icons/ri';
import ScrollToBottom from 'react-scroll-to-bottom';
import Messages from '../Messages/Messages';

const Chat = (props) => {
  const [messages, setMessages] = useState([])
  const { id } = useParams()
  const [message, setMessage] = useState('')
  const { username, userId, socket } = props

  const sendMessage = e => {
    e.preventDefault()

    socket.emit('message', { socketUserId: userId, username, message, roomId: id })
    setMessage('')
  }

  useEffect(() => {
    if (socket) {
      socket.on('message', ({ socketUserId, username, message }) => {
        setMessages(m => {
          return [...m, { socketUserId, username, message }]
        })
      })
    }
  }, [socket])

  // useEffect(() => {
  //   if (socket) { socket.emit('join-room', { roomId: id, username }) }

  // }, [id, socket])

  return (
    <div className='chat-container'>
      <ScrollToBottom className='messages-container' debug={false}>
        {messages.map((el, id) => (
          <Messages
            key={id}
            socketUserId={el.socketUserId}
            userId={userId}
            message={el.message}
            username={el.username}
          />

          // <section className={el.socketUserId === userId ? 'chat-message local-user' : 'chat-message'} key={ id }>
          //   <h3>{ReactEmoji.emojify(el.message)}</h3>
          //   <p>{el.username}</p>
          // </section>
        ))}
      </ScrollToBottom>
      <form>
        <input
          onChange={e => setMessage(e.target.value)}
          value={message}
          placeholder='Your Message...' />
        <button onClick={e => sendMessage(e)}><RiSendPlaneFill size='1.5rem' /></button>
      </form>
    </div>
  )
}

export default Chat;