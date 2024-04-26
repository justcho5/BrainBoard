import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import "./SignupForm.css";
export const SignupForm = ({ ...props }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSignup = (event) => {
    event.preventDefault();
    props.handleSignup({ name, username, password, confirmPassword });
    setUsername("");
    setPassword("");
    setName("");
    setConfirmPassword("");
  };
  return (
    <div className="signup-form">
      <form className="login-form" onSubmit={handleSignup}>
        <div className="signup-input">
          <label>Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            name="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="signup-input">
          <label>Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="signup-input">
          <label>Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="signup-input">
          <label>Confirm password:</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            name="ConfirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button className="signup-button" type="submit">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

SignupForm.propTypes = {
  handleSignup: PropTypes.func.isRequired,
};
