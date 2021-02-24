

const Tracks = (props) => {
    const { trUri, trName, trId } = props


    return (
        <div>
            <h3 onDoubleClick={() => { props.addTrack(trUri, trId) }}>{trName}</h3>
        </div>
    )
}

export default Tracks