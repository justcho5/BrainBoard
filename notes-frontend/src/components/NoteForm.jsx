import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./NoteForm.css";

export const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("");

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: false,
    });
    setNewNote("");
  };
  return (
    <div>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          placeholder="Save a quick note, thought, or idea!"
          onChange={(e) => setNewNote(e.target.value)}
          className="border border-gray-400 p-2 rounded"
        />
        <Button type="submit" variant="secondary">
          Save
        </Button>
      </form>
    </div>
  );
};
