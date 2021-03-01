import ReactEmoji from 'react-emoji';

const Messages = props => {
    const { socketUserId, userId, message, username } = props
    return (
        <section className={socketUserId === userId ? 'chat-message local-user' : 'chat-message'}>
            <h3>{ReactEmoji.emojify(message)}</h3>
            <p>{username}</p>
        </section>
    )
}

export default Messages;