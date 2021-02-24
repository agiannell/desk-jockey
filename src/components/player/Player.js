import SpotifyPlayer from 'react-spotify-web-playback';
import { connect } from 'react-redux';

const Player = props => {
  const { accessToken, desktopDjPL } = props
  
  return (
    <section>
      <SpotifyPlayer
        className='player'
        token={accessToken}
        uris={desktopDjPL.map(e => e.track.uri)}
        styles={{
          bgColor: '#160F29',
          sliderColor: '#246A73',
          color: '#F3DFC1',
          trackNameColor: '#F3DFC1',
          loaderColor: '#246A73',
          activeColor: 'red'
        }} />
    </section>
  )
}

const mapStateToProps = reduxState => ({
  accessToken: reduxState.userReducer.accessToken
})

export default connect(mapStateToProps)(Player); 