import Header from "../header/Header";
import {useState} from 'react';
import axios from 'axios';

const Contact = (props) => {
  const [firstName, setFirstName] = useState(""),
    [lastName, setLastName] = useState(""),
    [email, setEmail] = useState(""),
    [subject, setSubject] = useState(""),
    [message, setMessage] = useState("");

  const sendEmail = () => {
    if (!email) {
      alert("Please completely fill out the form");
    } else if (!firstName) {
      alert("Please completely fill out the form");
    } else if (!lastName) {
      alert("Please completely fill out the form");
    } else if (!subject) {
      alert("Please completely fill out the form");
    } else if (!message) {
      alert("Please completely fill out the form");
    } else {
      axios
        .post("/api/email", { firstName, lastName, subject, email, message })
        .then(() => {
          window.alert("Message Sent!");
          setFirstName("");
          setLastName("");
          setEmail("");
          setSubject("");
          setMessage("");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className='contact-container'>
      <Header />
      <section className="email-form">
        <h1>Contact Us</h1>
        <form className="form">
          <section className="form-line">
            <input
              placeholder='First Name'
              value={firstName}
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              placeholder='Last Name'
              value={lastName}
              type="text"
              onChange={(e) => setLastName(e.target.value)}
            />
          </section>
          <section className="form-line">
            <input
              placeholder='Email Address'
              value={email}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder='Subject'
              value={subject}
              type="text"
              onChange={(e) => setSubject(e.target.value)}
            />
          </section>
          <section className="form-line">
            <textarea
              placeholder="What's on your mind?"
              value={message}
              type="text"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </section>
          <button onClick={() => sendEmail()}>Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
