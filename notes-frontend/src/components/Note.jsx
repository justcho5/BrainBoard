import { Button } from "react-bootstrap";
import "./Note.css";
const Note = ({ note, toggleImportance, username, deleteNote }) => {
  const label = note.important ? "important" : "not important";

  return (
    <tr>
      <td>
        <span className="hover:line-through cursor-pointer">
          {note.content}
        </span>
      </td>
      <td>
        <span
          onClick={toggleImportance}
          className="cursor-pointer hover:font-medium"
        >
          {` ${label}`}
        </span>
      </td>
      <td>
        <span>{username}</span>
      </td>
      <td>
        <Button variant="link" onClick={() => deleteNote(note.id)}>
          Delete
        </Button>
      </td>
    </tr>
  );
};
export default Note;
