import React from 'react'
import common from '../common.js'
import mailIcon from '../resources/ui/mail.svg'


function PopupDownload(props) {
  let [firstName, setFirstName] = React.useState("");
  let [lastName, setLastName] = React.useState("");
  let [email, setEmail] = React.useState("");

  let handleSubmit = (e) => {
    e.preventDefault();
    props.handler({
      firstName: firstName,
      lastName: lastName,
      email: email
    });
  }

  let enabled = email && common.validEmail(email);

  return (
    <div className="pop-up-content">
      {props.sent ? (
        <React.Fragment>
          <div style={{textAlign: "center"}}>
            <h1 className="pop-up-header">Sent!</h1>
            <img alt="Email Sent" style={{width: "3rem"}} src={mailIcon}></img>
            <p className="pop-up-text download-instructions">
              Your download link has been sent to "{email}". Check your email!
            </p>
          </div>

        </React.Fragment>
      ) : (
        <form id="download-form" onSubmit={handleSubmit}>
          <h1 className="pop-up-header">Download this resource for free!</h1>
          <p className="pop-up-text download-instructions">Enter your email address below to receive a free download link.</p>
          <div className="first-last-container">
            <input
              type="text"
              className="text-input name-input"
              name="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
            />
            <input
              type="text"
              className="text-input name-input"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <input
            type="email"
            className="text-input"
            name="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <input
            type="submit"
            className="form-button"
            disabled={!enabled}
            value="SEND DOWNLOAD LINK"
          />
        </form>
      )}
    </div>
  )
}

export default PopupDownload
