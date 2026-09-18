require('dotenv').config()

const {
  NODE_ENV,
  SERVER_PORT,
  CONNECTION_STRING,
  SESSION_SECRET,
  REACT_APP_BASE_URL,
  CALLBACK_BASE_URL,
  S3_BUCKET,
  AMAZON_ACCESS_KEY_ID,
  AMAZON_SECRET_ACCESS_KEY,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  EMAIL_USERNAME,
  EMAIL_PASSWORD
} = process.env

const isProduction = NODE_ENV === 'production'

module.exports = {
  isProduction,
  port: SERVER_PORT,
  connectionString: CONNECTION_STRING,
  sessionSecret: SESSION_SECRET,
  baseUrl: REACT_APP_BASE_URL,
  callbackBaseUrl: CALLBACK_BASE_URL,
  aws: {
    bucket: S3_BUCKET,
    accessKeyId: AMAZON_ACCESS_KEY_ID,
    secretAccessKey: AMAZON_SECRET_ACCESS_KEY
  },
  spotify: {
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: `${REACT_APP_BASE_URL}/callback`
  },
  email: {
    username: EMAIL_USERNAME,
    password: EMAIL_PASSWORD
  }
}
