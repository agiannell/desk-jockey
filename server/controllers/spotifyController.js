const request = require('request')
const config = require('../config')

module.exports = {
  spotifyLogin: (_req, res) => {
    const params = {
      response_type: 'code',
      client_id: config.spotify.clientId,
      scope:
        'streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify playlist-read-private playlist-modify-public playlist-modify-private',
      redirect_uri: config.spotify.redirectUri
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
        redirect_uri: config.spotify.redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer.from(
            config.spotify.clientId + ':' + config.spotify.clientSecret
          ).toString('base64')
      },
      json: true
    }
    try {
      request.post(authOptions, (_error, _response, body) => {
        var access_token = body.access_token
        req.session.token = access_token
        res.redirect(`${config.callbackBaseUrl}/`)
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
