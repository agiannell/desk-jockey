module.exports = {
    getPublicRooms: (req, res) => {
        const db = req.app.get('db');

        db.rooms.get_public_rooms()
            .then(rooms => {
                res.status(200).send(rooms)
            })
            .catch(err => res.status(500).send(err));
    },

    getPrivateRooms: (req, res) => {
        const db = req.app.get('db');

        db.rooms.get_private_rooms()
            .then(rooms => {
                res.status(200).send(rooms)
            })
            .catch(err => res.status(500).send(err));
    },

    getMyRooms: (req, res) => {
        const db = req.app.get('db'),
        {user_id} = req.params;

        db.rooms.get_my_rooms([user_id])
            .then(rooms => {
                res.status(200).send(rooms)
            })
            .catch(err => res.status(500).send(err));
    },

    joinRoom: (req, res) => {
        const db = req.app.get('db'),
        {room_id} = req.body,
        {user_id} = req.session.user;

        db.rooms.add_to_my_rooms([room_id, user_id])
            .then(() => {
                res.sendStatus(200)
            })
            .catch(err => res.status(500).send())
    },

    newRoom: async (req, res) => {
        const db = req.app.get('db')
        const { roomName, password, imgUrl, isPrivate, isCollaborative, genre, createdBy } = req.body

        const [newRoom] = await db.rooms.add_room([roomName, password, imgUrl, isPrivate, isCollaborative, genre, createdBy])

        res.status(201).send(newRoom)

    },

    getRoomInfo: async (req, res) => {
        const { room_id } = req.params,
            db = req.app.get('db');

        const [room] = await db.rooms.get_room_info(room_id)

        res.status(200).send(room)
    },

    delete: (req, res) => {
        const db = req.app.get('db'),
            { room_id } = req.params;

        db.rooms.delete_room(room_id)
        res.sendStatus(200)
    }
}