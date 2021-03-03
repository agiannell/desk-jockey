const querystring = require('querystring'),
  request = require('request'),
  { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET } = process.env;


module.exports = {
  spotifyLogin: (req, res) => {
    console.log('hit')
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: 'streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify playlist-read-private playlist-modify-public playlist-modify-private',
        redirect_uri: REDIRECT_URI
      }))
  },
  spotifyCallback: (req, res) => {
    let code = req.query.code || null
    console.log(code)
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(
          CLIENT_ID + ':' + CLIENT_SECRET
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function (error, response, body) {
      // console.log(body)
      var access_token = body.access_token
      req.session.token = access_token
      let uri = 'https://deskjockey.us/' || REDIRECT_URI
      res.redirect(uri)
    })
    // console.log(req.session.token)
  },
  pizza: (req, res) => {
    res.status(200).send(req.session.token)
  }
}