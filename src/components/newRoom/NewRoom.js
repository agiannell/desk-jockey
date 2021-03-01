import axios from "axios";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { v4 as randomString } from "uuid";
import Dropzone from "react-dropzone";
import { ScaleLoader } from "react-spinners";
import { MdClose } from 'react-icons/md'
import albumDefault from '../../assets/img/default-album.png';

const NewRoom = (props) => {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [genre, setGenre] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const { setIsCreating, setIsLoading } = props;

  useEffect(() => {
    setCreatedBy(props.localUser.user_id);
  }, []);

  const getSignedRequest = ([file]) => {
    console.log(file);
    setIsUploading(true);
    const fileName = `${randomString()}-${file.name.replace(/\s/g, "-")}`;

    axios
      .get("/api/signs3", {
        params: {
          "file-name": fileName,
          "file-type": file.type,
        }
      })
      .then((res) => {
        const { signedRequest, url } = res.data;
        uploadFile(file, signedRequest, url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFile = (file, signedRequest, url) => {
    const options = {
      headers: {
        "Content-Type": file.type,
      },
    };

    axios
      .put(signedRequest, file, options)
      .then((res) => {
        setIsUploading(false);
        setImgUrl(url)
      })
      .catch((err) => {
        setIsUploading(false);
        if (err.response.status === 400) {
          alert(
            "Upload failed, check CORS configuration and bucket policy. Double check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
          );
        } else {
          alert(`ERROR: ${err.status} ${err.stack}`);
        }
      });
  };

  const handleCreateRoom = () => {
    setIsLoading(true);

    axios
      .post("/api/room", {
        roomName,
        password,
        imgUrl,
        isPrivate,
        isCollaborative,
        genre,
        createdBy,
      })
      .then((res) => {
        const { room_id } = res.data;

        axios.post('/api/joinroom', { room_id })
          .then(() => {
            props.history.push("/Dash");
            setIsLoading(false);
          })
          .catch((err) => console.log(err));

      });
  };

  console.log(isCollaborative);
  return (
    <div className='new-room-container'>
      <form>
        <section className='new-room-form'>
          <h2>Create a Room</h2>
          <MdClose className='new-room-close' onClick={() => setIsCreating(false)} />
          <section className='new-room-line'>
            <input
              placeholder="Room Name"
              name="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </section>
          <section className='new-room-line'>
            <input
              type="checkbox"
              id="private"
              name='isPrivate'
              defaultChecked={isPrivate}
              value={true}
              onChange={() => setIsPrivate(!isPrivate)} />
            <label htmlFor="private">Private</label>
            <input
              className={!isPrivate ? 'hidden' : null}
              placeholder="Code Word"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </section>
          <section className="new-room-radio">
            <input
              type="radio"
              id="collaborative"
              name="room type"
              value={true}
              onChange={(e) => setIsCollaborative(e.target.value)} />
            <label htmlFor="collaborative">Collaborative</label>
            <input
              type="radio"
              id="exclusive"
              name="room type"
              value={false}
              defaultChecked
              onChange={(e) => setIsCollaborative(e.target.value)} />
            <label htmlFor="exclusive">Non-Collaborative</label>
          </section>
          <section className="new-room-line">
            <input
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)} />
          </section>
          <section className="new-room-upload">
            <img src={imgUrl ? imgUrl : albumDefault} alt='album art' />
            <Dropzone
              onDropAccepted={(file) => getSignedRequest(file)}
              accept="image/*"
              multiple={false}>

              {({ getRootProps, getInputProps }) => (
                <div className='dropzone'
                  {...getRootProps()}>
                  <input {...getInputProps()} />
                  { isUploading ? <ScaleLoader color='#246A73' /> : <p>Drop room image here, or click to select a file</p>}
                </div>
              )}
            </Dropzone>
          </section>
        </section>
        <button id='create-room-btn' onClick={() => handleCreateRoom()}>Create Room</button>
      </form>
      <section className='new-room-invite'>
        <h2>Invite your friends to listen!</h2>
        <input id='invite-input' placeholder="Enter email address" />
        <button id='invite-btn'>Add</button>
      </section>
    </div>
  );
};

const mapStateToProps = (reduxState) => {
  return {
    localUser: reduxState.userReducer.localUser,
  };
};

export default connect(mapStateToProps, {})(NewRoom);
