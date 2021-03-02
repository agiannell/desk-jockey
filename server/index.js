require("dotenv").config();
const cors = require("cors");
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const userCtrl = require("./controllers/userController");
const roomCtrl = require("./controllers/roomController");
const spotifyCtrl = require("./controllers/spotifyController");
const emailCtrl = require("./controllers/emailController");
const aws = require("aws-sdk");
const {
  SERVER_PORT,
  CONNECTION_STRING,
  SESSION_SECRET,
  S3_BUCKET,
  AMAZON_ACCESS_KEY_ID,
  AMAZON_SECRET_ACCESS_KEY,
} = process.env;
const app = express();

app.use(express.static(`${__dirname}/../build`));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set("db", db);
  console.log("DB is Connected");
  const io = require("socket.io")(
    app.listen(SERVER_PORT, () =>
      console.log(`Listening on Port: ${SERVER_PORT}`)
    ),
    { cors: { origin: true } }
  );
  app.set("io", io);
  io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`);
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
    socket.on("message", ({ socketUserId, username, message, roomId }) => {
      io.in(roomId).emit("message", { socketUserId, username, message })
    });
    socket.on("join-room", ({ roomId, username }) => {
      socket.join(roomId);
      console.log(socket.rooms);
      io.in(roomId).emit("user-joined", { username });
    });
    socket.on('queue', ({ trUri, trId, trName, artist, trImg, username, roomId }) => {
      io.in(roomId).emit('queue', { trUri, trId, trName, artist, trImg, username })
    })
  });
});

app.get("/api/signs3", (req, res) => {
  aws.config = {
    region: "us-west-1",
    accessKeyId: AMAZON_ACCESS_KEY_ID,
    secretAccessKey: AMAZON_SECRET_ACCESS_KEY,
  };

  const s3 = new aws.S3(),
    fileName = req.query["file-name"],
    fileType = req.query["file-type"],
    s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: "public-read",
    };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3-us-west-1.amazonaws.com/${fileName}`,
    };
    return res.send(returnData);
  });
});

//Spotify Endpoints
app.get("/login", spotifyCtrl.spotifyLogin);
app.get("/callback", spotifyCtrl.spotifyCallback);
app.get("/pizza", spotifyCtrl.pizza);

// User Endpoints
app.get("/api/check-user/:email", userCtrl.checkUser);
app.post("/api/user", userCtrl.createUser);
app.get("/api/logout", userCtrl.logout);
app.get("/api/user", userCtrl.getUser);

// Room Endpoints
app.get('/api/rooms', roomCtrl.getPublicRooms);
app.get('/api/privaterooms', roomCtrl.getPrivateRooms);
app.get('/api/myrooms/:user_id', roomCtrl.getMyRooms);
app.get('/api/room/:room_id', roomCtrl.getRoomInfo);
app.post('/api/joinroom', roomCtrl.joinRoom);
app.post('/api/room', roomCtrl.newRoom);
app.delete('/api/room/:room_id', roomCtrl.delete);

//Email endpoint
app.post("/api/email", emailCtrl.sendEmail);
app.post('/api/invite', emailCtrl.sendInvite);
