import { useEffect } from 'react'
import { connect } from 'react-redux'
import stackedLogo from '../../assets/img/logos/logo-stacked-white.svg';
import { FaSpotify } from 'react-icons/fa';
import axios from 'axios';
import { setAccessToken } from '../../ducks/reducer/userReducer'

const Auth = props => {

  useEffect(() => {
    axios.get('/pizza/')
      .then(res => {
        console.log(res.data)
        props.setAccessToken(res.data)
        // send res.data to user reducer * attach import connect into auth and bring in function, fire update redux, attach access token prop to reducer as prop so that re render is triggered and check for if accessToken is truthy turn redirect to /dash.
        // if(res.data){
        //   props.history.push('/Dash')
        // }
      })
  }, [])

  useEffect(() => {
    if (props.accessToken) { props.history.push('/Dash') }

  }, [props.accessToken])

  return (
    <section>
      <section className="auth-main">
        <section className="auth-img">
          <section className="auth-login">
            <img src={stackedLogo} alt='logo' />
            <a href="https://deskjockey.us/login">login with Spotify&nbsp;&nbsp;&nbsp;<FaSpotify /></a>
          </section>
        </section>
      </section>
      <section className="auth-section">Section 1 Content</section>
      <section className="auth-section lighten">Section 2 Content</section>
      <section className="auth-section">Section 3 Content</section>
      <section className="auth-section lighten">
        <a href="https://deskjockey.us/login">login with Spotify&nbsp;&nbsp;&nbsp;<FaSpotify /></a>
      </section>
    </section>
  )
}

const mapStateToProps = (reduxState) => {
  accessToken: reduxState.userReducer.accessToken
}

export default connect(mapStateToProps, { setAccessToken })(Auth);