let accessToken

module.exports = {
    createUser: async (req, res) => {
        const { displayName, email, profilePic } = req.body,
            defaultPic = 'https://unlocked-default-pic.s3-us-west-1.amazonaws.com/default-profile-pic.svg'
            db = req.app.get('db');

        console.log(profilePic)
        if(!profilePic){
            const [user] = await db.users.create_user([displayName, email, defaultPic])
            res.status(200).send(user)  
        } else {
            const [user] = await db.users.create_user([displayName, email, profilePic])
            res.status(200).send(user)  
        }
        // const [foundUser] = await db.users.check_user(email);
        // if (foundUser) {
        //     return res.sendStatus(100)
        // };

    },

    checkUser: async (req, res) => {
        const { email } = req.params,
            db = req.app.get('db');

        const [user] = await db.users.check_user(email)
        // console.log(user)
        req.session.user = user
        res.status(200).send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200);
    }
}