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

    checkAdmin: async (req, res) => {
        const db = req.app.get('db')

        const { room_id } = req.params

        const [created_by] = await db.rooms.check_admin(room_id)

        res.status(200).send(created_by)
    }
}