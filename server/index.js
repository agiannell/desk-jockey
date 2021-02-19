require('dotenv').config();
const cors = require('cors');
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const querystring = require('querystring');
const request = require('request');
const userCtrl = require('./controllers/userController');
const roomCtrl = require('./controllers/roomController');
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET, CLIENT_ID, REDIRECT_URI, CLIENT_SECRET } = process.env;
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 }
}))

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
}).then(db => {
  app.set('db', db)
  console.log('DB is Connected')
  app.listen(SERVER_PORT, () => console.log(`Listening on Port: ${SERVER_PORT}`))
})

app.get('/login', function (req, res) {
  console.log('hit')
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: 'user-read-private user-read-email',
      redirect_uri: REDIRECT_URI
    }))
})

app.get('/callback', function (req, res) {
  let code = req.query.code || null
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
    let uri = 'http://localhost:3000/Dash' || REDIRECT_URI
    res.redirect(uri)
  })
  // console.log(req.session.token)
})

app.get('/pizza', (req, res) => {
  // console.log(req.session.token)
  res.status(200).send(req.session.token)
})

// User Endpoints
app.get('/api/check-user/:email', userCtrl.checkUser);

app.post('/api/user', userCtrl.createUser);

// Room Endpoints
app.get('/api/rooms', roomCtrl.getPublicRooms);