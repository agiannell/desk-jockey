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
    <div>
      <Header />
      <section className="email-form">
        <form className="form">
          <section id="name-input">
            <label for="firstname">First Name: </label>
            <input
              value={firstName}
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label for="lastname">Last Name: </label>
            <input
              value={lastName}
              type="text"
              onChange={(e) => setLastName(e.target.value)}
            />
          </section>
          <section id="email-subject">
            <label for="email">Email: </label>
            <input
              value={email}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label id="subject" for="subject">
              Subject:{" "}
            </label>
            <input
              value={subject}
              type="text"
              onChange={(e) => setSubject(e.target.value)}
            />
          </section>
          <section id="message-area">
            <label for="message" id="message-header">
              Message:{" "}
            </label>
            <textarea
              value={message}
              id="message"
              type="text"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button onClick={() => sendEmail()}>Send Message</button>
          </section>
        </form>
      </section>
    </div>
  );
};

export default Contact;
