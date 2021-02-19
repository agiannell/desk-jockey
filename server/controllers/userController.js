module.exports = {
    createUser: async(req, res) => {
        const { displayName, email, profilePic } = req.body,
              db = req.app.get('db');

        !profilePic ? profilePic = 'https://unlocked-default-pic.s3-us-west-1.amazonaws.com/default-profile-pic.svg' : null

        // const [foundUser] = await db.users.check_user(email);
        // if (foundUser) {
        //     return res.sendStatus(100)
        // };

        const [user] = await db.users.create_user([displayName, email, profilePic])
        res.status(200).send(user)
    },
    checkUser: (req, res) => {
        const { email } = req.params,
              db = req.app.get('db');

        db.users.check_user(email)
            .then(user => {
                // console.log(user)
                res.status(200).send(user)
            })
            .catch(err => res.status(500).send(err))
    }    
}