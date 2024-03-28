import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import { login } from "./services/login";
import { LoginForm } from "./components/LoginForm";
import { Togglable } from "./components/Togglable";
import { NoteForm } from "./components/NoteForm";
import { Button, Table } from "react-bootstrap";

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };
  return (
    <div className="mt-auto">
      <br />
      <em>Note app 2023</em>
    </div>
  );
};
const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [user, setUser] = useState(null);

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
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  // Toggle note importance
  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  // Add note handler
  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then((responseBody) => {
        setNotes([{ ...responseBody, user: { name: user.name } }, ...notes]);
      })
      .catch((error) => {
        setErrorMessage(error.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);

        if (error.error === "token expired") {
          setUser(null);
          noteService.setToken(null);
          window.localStorage.removeItem("loggedNoteappUser");
        }
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  // Login handler
  const handleLogin = async (loginObject) => {
    try {
      const user = await login(loginObject);
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setSuccessMessage(`Welcome ${user.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  // Logout handler
  const handleLogout = (event) => {
    setUser(null);
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

  const noteForm = () => <NoteForm createNote={addNote} />;
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
      <div className="toolbar">
        {noteForm()}
        <Button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </Button>
      </div>
      <Table striped>
        <tbody>
          {notesToShow.map((note) => {
            return (
              <Note
                key={note.id}
                note={note}
                toggleImportance={() => toggleImportanceOf(note.id)}
                username={note.user?.name}
              />
            );
          })}
        </tbody>
      </Table>

      <Footer />
    </div>
  );
};

export default App;
