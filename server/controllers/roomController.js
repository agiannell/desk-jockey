module.exports = {
    getPublicRooms: (req, res) => {
        const db = req.app.get('db');

        db.rooms.get_public_rooms()
            .then(rooms => {
                res.status(200).send(rooms)
            })
            .catch(err => res.status(500).send(err));
    }
}