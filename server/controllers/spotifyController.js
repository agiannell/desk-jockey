require('dotenv').config();
const request = require('request');
const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_CLIENT_SECRET, BASE_URL_DEV, REACT_APP_BASE_URL_DEV } = process.env;
const env = process.env.NODE_ENV || 'development';


module.exports = {
  spotifyLogin: (_req, res) => {
    console.log('hit');
    const params = {
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: 'streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify playlist-read-private playlist-modify-public playlist-modify-private',
      redirect_uri: SPOTIFY_REDIRECT_URI
    }
    let spotifyAuthParams = new URLSearchParams(params);
    res.redirect('https://accounts.spotify.com/authorize?' + spotifyAuthParams.toString())
  },
  spotifyCallback: (req, res) => {
    let code = req.query.code || null
    // console.log(code)
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(
          SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function (error, response, body) {
      // console.log(body)
      var access_token = body.access_token
      req.session.token = access_token
      let uri = env !== 'production' ? BASE_URL_DEV : `${REACT_APP_BASE_URL_DEV}/` || SPOTIFY_REDIRECT_URI
      res.redirect(uri)
    })
    // console.log(req.session.token)
  },
  pizza: (req, res) => {
    res.status(200).send(req.session.token)
  }
}