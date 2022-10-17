require('dotenv').config()
const request = require('request')
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, REACT_APP_BASE_URL_PROD } =
  process.env

module.exports = {
  spotifyLogin: (_req, res) => {
    const params = {
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope:
        'streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify playlist-read-private playlist-modify-public playlist-modify-private',
      redirect_uri: REACT_APP_BASE_URL_PROD + '/callback'
    }
    let spotifyAuthParams = new URLSearchParams(params)
    res.redirect(
      'https://accounts.spotify.com/authorize?' + spotifyAuthParams.toString()
    )
  },
  spotifyCallback: (req, res) => {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REACT_APP_BASE_URL_PROD + '/callback',
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer.from(
            SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
          ).toString('base64')
      },
      json: true
    }
    try {
      request.post(authOptions, (_error, _response, body) => {
        var access_token = body.access_token
        req.session.token = access_token
        let uri =
          `${REACT_APP_BASE_URL_PROD}/` || REACT_APP_BASE_URL_PROD + '/callback'
        res.redirect(uri)
      })
    } catch (error) {
      if (error instanceof Error) {
        console.log('Could not fetch spotify token: ', error.message)
        res.status(400).send({ error: error.name, message: error.message })
      }
    }
  },
  pizza: (req, res) => {
    if (req.session.token) {
      res.status(200).send({token: req.session.token, message: 'token found'})
    } else res.status(404).send({token: null, message: 'spotify token not found'})
  }
}
