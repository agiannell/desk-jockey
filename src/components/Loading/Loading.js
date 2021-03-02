import { ScaleLoader } from 'react-spinners';

const Loading = props => {
    return (
        <section className='loading-container'>
            <ScaleLoader
                height={ 70 }
                width={ 8 }
                radius={ 4 }
                margin={ 4 }
                color='#F3DFC1' />
            <h1>deskjokey</h1>
        </section>
    )
}

export default Loading;