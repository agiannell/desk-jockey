import { MdPlaylistAdd } from 'react-icons/md';

const Tracks = (props) => {
    const { trUri, trName, trId } = props


    return (
        <div className='track-render' onDoubleClick={() => { props.addTrack(trUri, trId) }}>
            <p>{trName}</p>
            <MdPlaylistAdd onClick={() => { props.addTrack(trUri, trId) }} />
        </div>
    )
}

export default Tracks