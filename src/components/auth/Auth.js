import { useEffect } from 'react'
import { connect } from 'react-redux'
import stackedLogo from '../../assets/img/logos/logo-stacked-white.svg';
import { FaSpotify } from 'react-icons/fa';
import axios from 'axios';
import { setAccessToken } from '../../ducks/reducer/userReducer'
import roomView from '../../assets/img/room-view.png';
import createRoom from '../../assets/img/create-room.png';
import { useNavigate } from 'react-router';

const Auth = props => {
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/pizza')
      .then(res => {
        // console.log(res.data)
        props.setAccessToken(res.data.token)
        // send res.data to user reducer * attach import connect into auth and bring in function, fire update redux, attach access token prop to reducer as prop so that re render is triggered and check for if accessToken is truthy turn redirect to /dash.
        // if(res.data){
        //   props.history.push('/Dash')
        // }
      })
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
            <a href={`${process.env.REACT_APP_BASE_URL}/login`}>login with Spotify&nbsp;&nbsp;&nbsp;<FaSpotify /></a>
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
        <a href={`${process.env.REACT_APP_BASE_URL}/login`}>login with Spotify&nbsp;&nbsp;&nbsp;<FaSpotify /></a>
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