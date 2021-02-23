

const Tracks = (props) => {
    const { trUri, trName } = props


    return (
        <div>
            <h3 onDoubleClick={() => { props.addTrack(trUri) }}>{trName}</h3>
        </div>
    )
}

export default Tracks