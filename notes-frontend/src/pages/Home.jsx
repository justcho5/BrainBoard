import React, { useEffect, useRef } from "react";
import { NotesTable } from "../components/NotesTable";
import noteService from "../services/notes";
import { useState } from "react";
import { useStore } from "../store";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Togglable } from "../components/Togglable";
import { SignupForm } from "../components/SignupForm";
import { signup } from "../services/users";
export const Home = () => {
  const {
    user,
    updateUser,
    updateSuccessMessage,
    updateErrorMessage,
    notes,
    updateNotes,
  } = useStore();
  const [notesToShow, setNotesToShow] = useState([]);
  const signupFormRef = useRef();
  useEffect(() => {
    if (user) {
      setNotesToShow(
        notes.filter((note) => note.user?.username === user.username)
      );
    } else {
      setNotesToShow([]);
    }
  }, [notes, user]);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    // setNotes([{ ...responseBody, user: { name: user.name } }, ...notes]);

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        updateNotes(
          notes.map((note) => (note.id !== id ? note : returnedNote))
        );
      })
      .catch((error) => {
        if (error.error === "token expired") {
          updateUser(null);
          noteService.setToken(null);
          window.localStorage.removeItem("loggedNoteappUser");
        }
        updateErrorMessage(error.error);
        setTimeout(() => {
          updateErrorMessage(null);
        }, 5000);
        // updateErrorMessage(
        //   `Note '${note.content}' was already removed from server`
        // );
        // setTimeout(() => {
        //   updateErrorMessage(null);
        // }, 5000);
        // setNotes(notes.filter((n) => n.id !== id));
      });
  };
  const deleteNote = (id) => {
    noteService
      .remove(id)
      .then(() => {
        updateNotes(notes.filter((note) => note.id !== id));
      })
      .catch((error) => {
        updateErrorMessage(error.error);
        setTimeout(() => {
          updateErrorMessage(null);
        }, 5000);

        if (error.error === "token expired") {
          updateUser(null);
          noteService.setToken(null);
          window.localStorage.removeItem("loggedNoteappUser");
        }
      });
  };
  // Add note handler
  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then((responseBody) => {
        updateNotes([{ ...responseBody, user: { name: user.name } }, ...notes]);
      })
      .catch((error) => {
        updateErrorMessage(error.error);
        setTimeout(() => {
          updateErrorMessage(null);
        }, 5000);

        if (error.error === "token expired") {
          updateErrorMessage(null);
          noteService.setToken(null);
          window.localStorage.removeItem("loggedNoteappUser");
        }
      });
  };
  const handleSignup = async (signupObject) => {
    try {
      if (signupObject.password !== signupObject.confirmPassword) {
        throw new Error("Passwords do not match. Please try again.");
      }
      const { name, username, password } = signupObject;
      await signup({ name, username, password });
      signupFormRef.current.toggleVisibility();
      updateSuccessMessage("Sign Up Successful. Please log in!");
      setTimeout(() => {
        updateSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      if (exception.error === "expected `username` to be unique") {
        updateErrorMessage("Username already taken. Please try again.");
        setTimeout(() => {
          updateErrorMessage(null);
        }, 5000);
        return;
      }
      updateErrorMessage(exception.message || exception.error);
      setTimeout(() => {
        updateErrorMessage(null);
      }, 5000);
    }
  };
  const signupForm = () => {
    return (
      <div>
        <Togglable buttonLabel="Sign Up" ref={signupFormRef}>
          <SignupForm handleSignup={handleSignup} />
        </Togglable>
      </div>
    );
  };
  return (
    <div>
      {user ? (
        <NotesTable
          notes={notesToShow}
          toggleImportanceOf={toggleImportanceOf}
          deleteNote={deleteNote}
          addNote={addNote}
          canDelete={true}
        />
      ) : (
        <div>
          <p>Sign in to see your notes or try with the following login:</p>
          <p>Username: mysticWanderer88</p>
          <p>Password: w@nderl0st</p>
          {signupForm()}
        </div>
      )}
    </div>
  );
};
