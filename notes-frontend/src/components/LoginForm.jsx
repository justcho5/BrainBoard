import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import "./LoginForm.css";
export const LoginForm = ({ ...props }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = (event) => {
    event.preventDefault();
    props.handleLogin({ username, password });
    setUsername("");
    setPassword("");
  };
  return (
    <div>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-input">
          <label>username:</label>
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="login-input">
          <label>password:</label>
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button id="login-button" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};
