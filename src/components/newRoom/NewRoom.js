import axios from "axios";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { v4 as randomString } from "uuid";
import Dropzone from "react-dropzone";
import { GridLoader } from "react-spinners";
import Header from "../header/Header";

const NewRoom = (props) => {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [isCollaborative, setIsCollaborative] = useState("");
  const [genre, setGenre] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  // const [equipment, setEquipment] = useState([]);
  // const [name, setName] = useState('');
  // const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

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
        },
      })
      .then((res) => {
        const { signedRequest, url } = res.data;
        setImgUrl(url);
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
        const {room_id} = res.data;
        
        axios.post('/api/joinroom', {room_id})
        .then(() => {
          props.history.push("/Dash");
        })
        .catch((err) => console.log(err));
        
      });
  };

  console.log(props);
  return (
    <div>
      <Header />
      <input
        placeholder="Room Name"
        name="roomName"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <form>
        <input
          type="radio"
          id="public"
          name="room type"
          value='false'
          onChange={(e) => setIsPrivate(e.target.value)}
        />
        <label for="public">Public</label>
        <br />
        <input
          type="radio"
          id="private"
          name="room type"
          value='true'
          onChange={(e) => setIsPrivate(e.target.value)}
        />
        <label for="private">Private</label>
        <br />
      </form>
      <input
        placeholder="Password for private Room"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="Room Image Url"
        value={imgUrl}
        onChange={(e) => setPic(e.target.value)}
      />
      <form>
        <input
          type="radio"
          id="collaborative"
          name="room type"
          value="True"
          onChange={(e) => setIsCollaborative(e.target.value)}
        />
        <label for="collaborative">Collaborative</label>
        <br />
        <input
          type="radio"
          id="exclusive"
          name="room type"
          value="False"
          onChange={(e) => setIsCollaborative(e.target.value)}
        />
        <label for="exclusive">Non-Collaborative</label>
        <br />
      </form>
      <input
        placeholder="genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />

      <Dropzone
        onDropAccepted={(file) => getSignedRequest(file)}
        accept="image/*"
        multiple={false}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              position: "relative",
              width: 160,
              height: 40,
              borderWidth: 2,
              marginTop: 25,
              borderColor: "gray",
              borderStyle: "solid",
              borderRadius: 5,
              display: "inline-block",
              fontSize: 10,
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <GridLoader />
            ) : (
                <p>Drop files here, or click to select files</p>
              )}
          </div>
        )}
      </Dropzone>

      <p>Invite your friends to listen!</p>
      <input placeholder="Enter email address" />
      <button>Add</button>
      <button onClick={() => handleCreateRoom()}>Create Room</button>
    </div>
  );
};

const mapStateToProps = (reduxState) => {
  return {
    localUser: reduxState.userReducer.localUser,
  };
};

export default connect(mapStateToProps, {})(NewRoom);
