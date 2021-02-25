import { MdPlaylistAdd } from 'react-icons/md';

const Tracks = (props) => {
    const { trUri, trName, trId } = props


    return (
        <div className='track-render'>
            <p>{trName}</p>
            <MdPlaylistAdd onDoubleClick={() => { props.addTrack(trUri, trId) }} />
        </div>
    )
}

export default Tracks