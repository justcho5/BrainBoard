import React from "react";
import { Table, Button } from "react-bootstrap";
import Note from "./Note";
import { NoteForm } from "./NoteForm";
import { useState } from "react";
export const NotesTable = ({
  notes,
  toggleImportanceOf,
  deleteNote,
  addNote,
  canDelete = false,
}) => {
  const [showAll, setShowAll] = useState(true);

  const noteForm = () => <NoteForm createNote={addNote} />;
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  return (
    <div>
      <div className="toolbar">
        {noteForm()}
        <Button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </Button>
      </div>
      <Table striped>
        <tbody>
          {notesToShow &&
            notesToShow.map((note) => {
              return (
                <Note
                  key={note.id}
                  note={note}
                  toggleImportance={() => toggleImportanceOf(note.id)}
                  username={note.user?.name}
                  deleteNote={deleteNote}
                  canDelete={canDelete}
                />
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};
