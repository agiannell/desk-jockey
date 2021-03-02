import { MdPlaylistAdd } from 'react-icons/md';

const Tracks = (props) => {
    const { trUri, trName, trId, artist, trImg } = props


    return (
        <div className='track-render' onDoubleClick={() => { props.addTrack(trUri, trId, trName, artist, trImg) }}>
            <p>{trName}</p>
            <MdPlaylistAdd onClick={() => { props.addTrack(trUri, trId, trName, artist, trImg) }} />
        </div>
    )
}

export default Tracks