import { connect } from "react-redux";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Header from '../header/Header'

const Chat = (props) => {
  const [socket,setSocket] = useState(null)

  useEffect(() => {
    if(!socket){
      setSocket(io.connect('http://localhost:4000'))
    } else {
      socket.on('user-joined',({username}) => {
        console.log(`${username} has joined the chat`)
      })
    }
    return () => {
      if(socket){socket.disconnect()}
    }
    
    
  },[socket])

  return (
    <div>
      <Header />
      <button onClick={() => socket.emit('message',{ test: 'pizza'})}>Hit me</button>
      <button onClick={() => socket.emit('join-room',{ roomId: 1, username: 'Ben'})}>join room</button>
    </div>
  )
}

export default Chat;