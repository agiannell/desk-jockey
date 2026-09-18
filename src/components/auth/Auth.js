import { useEffect } from 'react'
import { connect } from 'react-redux'
import stackedLogo from '../../assets/img/logos/logo-stacked-white.svg';
import { FaSpotify } from 'react-icons/fa';
import axios from 'axios';
import config from '../../config'
import { setAccessToken } from '../../ducks/reducer/userReducer'
import roomView from '../../assets/img/room-view.png';
import createRoom from '../../assets/img/create-room.png';
import { useNavigate } from 'react-router';

const Auth = props => {
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/pizza')
      .then(res => {
        props.setAccessToken(res.data.token)
      })
      .catch(err => console.log(err))
  }, [props])

  useEffect(() => {
    if (props.accessToken) { navigate('/Dash') }

  }, [props.accessToken, navigate])
  
  return (
    <section>
      <section className="auth-main">
        <section className="auth-img">
          <section className="auth-login">
            <img src={stackedLogo} alt='logo' />
            <a href={config.loginUrl}>login with Spotify&nbsp;&nbsp;&nbsp;<FaSpotify /></a>
          </section>
        </section>
      </section>
      <section className="auth-section lighten">
        <h1>Listen to music with your Friends!</h1>
        <img src={ roomView } alt='room view' />
      </section>
      <section className="auth-section">
        <img src={ createRoom } alt='create view' />
        <h1>Create rooms to customize your experience!</h1>
      </section>
      <section className="auth-section lighten">
        <a href={config.loginUrl}>login with Spotify&nbsp;&nbsp;&nbsp;<FaSpotify /></a>
      </section>
    </section>
  )
}

const mapStateToProps = (reduxState) => {
  return {
    accessToken: reduxState.userReducer.accessToken
  }
}

export default connect(mapStateToProps, { setAccessToken })(Auth);