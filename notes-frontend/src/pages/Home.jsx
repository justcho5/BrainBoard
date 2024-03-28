import React, { useEffect } from "react";
import { NotesTable } from "../components/NotesTable";
import noteService from "../services/notes";
import { useState } from "react";
import { useStore } from "../store";
export const Home = ({ allNotes }) => {
  const [notes, setNotes] = useState([]);
  const { user, updateUser, updateErrorMessage } = useStore();
  console.log(user);
  useEffect(() => {
    if (user) {
      setNotes(allNotes.filter((note) => note.user?.name === user.name));
    } else {
      setNotes([]);
    }
  }, [allNotes, user]);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch(() => {
        updateErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          updateErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };
  const deleteNote = (id) => {
    noteService
      .remove(id)
      .then(() => {
        setNotes(notes.filter((note) => note.id !== id));
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
        setNotes([{ ...responseBody, user: { name: user.name } }, ...notes]);
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
  return (
    <div>
      <NotesTable
        notes={notes}
        toggleImportanceOf={toggleImportanceOf}
        deleteNote={deleteNote}
        addNote={addNote}
      />
    </div>
  );
};
