const baseUrl = process.env.REACT_APP_BASE_URL

// The Express server is only reachable on :4004 directly in production;
// locally REACT_APP_BASE_URL already points straight at the dev server.
const socketUrl =
  process.env.NODE_ENV === 'production' ? `${baseUrl}:4004/` : `${baseUrl}/`

const config = {
  baseUrl,
  loginUrl: `${baseUrl}/login`,
  socketUrl
}

export default config
