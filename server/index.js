require('dotenv').config();
const cors = require('cors');
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const userCtrl = require('./controllers/userController');
const roomCtrl = require('./controllers/roomController');
const spotifyCtrl = require('./controllers/spotifyController');
const emailCtrl = require('./controllers/emailController');
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;
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

//Spotify Endpoints
app.get('/login', spotifyCtrl.spotifyLogin)
app.get('/callback', spotifyCtrl.spotifyCallback)
app.get('/pizza', spotifyCtrl.pizza)

// User Endpoints
app.get('/api/check-user/:email', userCtrl.checkUser);
app.post('/api/user', userCtrl.createUser);
app.get('/api/logout', userCtrl.logout);

// Room Endpoints
app.get('/api/rooms', roomCtrl.getPublicRooms);

//Email endpoint
app.post('/api/email', emailCtrl.sendEmail);