import { useState, useEffect, useRef } from "react";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import { login } from "./services/login";
import { LoginForm } from "./components/LoginForm";
import { Togglable } from "./components/Togglable";
import { Button } from "react-bootstrap";
import { useStore } from "./store";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Community } from "./pages/Community";
import { Home } from "./pages/Home";

const Footer = () => {
  return (
    <footer className="mt-auto">
      <br />
      <em>Note app 2023</em>
    </footer>
  );
};
const App = () => {
  const {
    user,
    updateUser,
    errorMessage,
    updateErrorMessage,
    successMessage,
    updateSuccessMessage,
    notes,
    fetchNotes,
  } = useStore();
  // Get notes from DB
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Check if user is logged in and set the User
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      updateUser(user);
      noteService.setToken(user.token);
    }
  }, [updateUser]);

  // Login handler
  const handleLogin = async (loginObject) => {
    try {
      const user = await login(loginObject);
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      updateUser(user);
      updateSuccessMessage(`Welcome ${user.name}`);
      setTimeout(() => {
        updateSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      updateErrorMessage("Wrong credentials");
      setTimeout(() => {
        updateErrorMessage(null);
      }, 5000);
    }
  };

  // Logout handler
  const handleLogout = (event) => {
    updateUser(null);
    noteService.setToken(null);
    window.localStorage.removeItem("loggedNoteappUser");
  };

  // Togglable Login Form
  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel="Log in">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      </div>
    );
  };

  return (
    <div className="container">
      <Router>
        <div className="header">
          <div className="links">
            <Link className="brainboard-link" to="/">
              <h1 className="text-3xl">BrainBoard</h1>
            </Link>
            <Link to="/community">Community</Link>
          </div>

          {user ? (
            <div>
              <span>Hi {user.name}</span>

              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            loginForm()
          )}
        </div>
        <Notification
          errorMessage={errorMessage}
          successMessage={successMessage}
        />

        <Routes>
          <Route path="/community" element={<Community allNotes={notes} />} />
          <Route path="/" element={<Home allNotes={notes} />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
};

export default App;
