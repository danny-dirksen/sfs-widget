import React from 'react'
import common from '../common.js'


function PopupDownload(props) {
  let [firstName, setFirstName] = React.useState("")
  let [lastName, setLastName] = React.useState("")
  let [email, setEmail] = React.useState("")
  let [clickable, setClickable] = React.useState(true)

  let handleSubmit = (e) => {
    e.preventDefault();
    props.handlers.downloadEmail({
      firstName: firstName,
      lastName: lastName,
      email: email
    })
    setClickable(false)
    setFirstName("");
    setLastName("");
    setEmail("");
  }

  let enabled = email && common.validEmail(email) && clickable

  return (
    <div className="pop-up-content">
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
              setLastName(e.target.value)
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
            setClickable(true)
            setEmail(e.target.value)
          }}
        />
        <input
          type="submit"
          className={`form-button${clickable ? "" : " sent"}`}
          disabled={!enabled}
          value={clickable ? "SEND DOWNLOAD LINK" : "SENT! Check your email!"}
        />
      </form>
    </div>
  )
}

export default PopupDownload
