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
        const { name, password, is_private, is_collaborative, genre, description, created_by } = req.body

        const [newRoom] = await db.rooms.add_room([name, password, is_private, is_collaborative, genre, description, created_by])

        res.status(201).send(newRoom)

    }
}