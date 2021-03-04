const users = [];

module.exports = {
    addUser: ({ socketId, roomId, username, accessToken }) => {
        username = username.trim().toLowerCase();

        const foundUser = users.find(user => {
            return user.roomId === roomId && user.username === username
        })

        if(foundUser) {
            return 'User already exists'
        }

        const user = { socketId, roomId, username, accessToken }
        users.push(user)

        return { user }
    },
    removeUser: (socketId) => {
        const index = users.findIndex(user => user.socketId === socketId)
        if(index !== -1) {
            return users.splice(index, 1)[0];
        }
    },
    getRoomUsers: (roomId) => {
        return users.filter(user => user.roomId === roomId)
    }
}