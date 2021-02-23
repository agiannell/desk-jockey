import profile from './defaultprofile.webp'
import Header from '../header/Header'

const Profile = (props) => {
  return (
    <div>
      <Header />
      <img src={profile} alt='Default Profile Picture' />
      <h1></h1>
    </div>
  )
}

export default Profile;