import { Button } from "react-bootstrap";
import "./Note.css";
const Note = ({ note, toggleImportance, username, deleteNote, canDelete }) => {
  const label = note.important ? "important" : "not important";

  return (
    <tr>
      <td>
        <span className="note-content">{note.content}</span>
      </td>
      <td>
        <span onClick={toggleImportance} className="importance">
          {` ${label}`}
        </span>
      </td>
      <td>
        <span>{username}</span>
      </td>
      {canDelete && (
        <td>
          <Button variant="link" onClick={() => deleteNote(note.id)}>
            Delete
          </Button>
        </td>
      )}
    </tr>
  );
};
export default Note;
