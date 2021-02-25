module.exports = {
    getPublicRooms: (req, res) => {
        const db = req.app.get('db');

        db.rooms.get_public_rooms()
            .then(rooms => {
                res.status(200).send(rooms)
            })
            .catch(err => res.status(500).send(err));
    },

    newRoom: async (req, res) => {
        const db = req.app.get('db')
        const { roomName, password, pic, isPrivate, isCollaborative, genre, createdBy } = req.body

        const [newRoom] = await db.rooms.add_room([roomName, password, pic, isPrivate, isCollaborative, genre, createdBy])

        res.status(201).send(newRoom)

    },

    getRoomInfo: async (req, res) => {
        const { room_id } = req.params,
              db = req.app.get('db');

        const [room] = await db.rooms.get_room_info(room_id)

        res.status(200).send(room)
    }
}