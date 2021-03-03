import { useEffect } from 'react'
import stackedLogo from '../../assets/img/logos/logo-stacked-white.svg';
import { FaSpotify } from 'react-icons/fa';
import axios from 'axios';

const Auth = props => {

  useEffect(() => {
    axios.get('/pizza/')
      .then(res => {
        console.log(res.data)
      })
  }, [])

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

export default Auth;