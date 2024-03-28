import { useState, useEffect, useRef } from "react";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import { login } from "./services/login";
import { LoginForm } from "./components/LoginForm";
import { Togglable } from "./components/Togglable";
import { Button } from "react-bootstrap";
import { useStore } from "./store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Community } from "./pages/Community";
import { Home } from "./pages/Home";
const Footer = () => {
  return (
    <div className="mt-auto">
      <br />
      <em>Note app 2023</em>
    </div>
  );
};
const App = () => {
  const [notes, setNotes] = useState([]);
  const {
    user,
    updateUser,
    errorMessage,
    updateErrorMessage,
    successMessage,
    updateSuccessMessage,
  } = useStore();
  // Get notes from DB
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes.reverse());
    });
  }, []);

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
        <Togglable buttonLabel="Sign in">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="text-3xl">BrainBoard</h1>

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

      <Router>
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
