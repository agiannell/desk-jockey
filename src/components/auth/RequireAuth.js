import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { setAccessToken } from '../../ducks/reducer/userReducer'

const RequireAuth = ({ accessToken, setAccessToken, children }) => {
  const [isChecking, setIsChecking] = useState(!accessToken)

  useEffect(() => {
    if (accessToken) {
      return
    }

    axios.get('/pizza')
      .then((res) => setAccessToken(res.data.token))
      .catch(() => {})
      .finally(() => setIsChecking(false))
  }, [accessToken, setAccessToken])

  if (isChecking) {
    return null
  }

  if (!accessToken) {
    return <Navigate to='/' replace />
  }

  return children
}

const mapStateToProps = (reduxState) => {
  return {
    accessToken: reduxState.userReducer.accessToken
  }
}

export default connect(mapStateToProps, { setAccessToken })(RequireAuth)
