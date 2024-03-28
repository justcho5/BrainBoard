import { Alert } from "react-bootstrap";

const Notification = ({ errorMessage = null, successMessage = null }) => {
  if (errorMessage === null && successMessage === null) {
    return null;
  }

  return (
    <div className="error">
      {errorMessage ? (
        <Alert variant="danger">{errorMessage}</Alert>
      ) : (
        <Alert variant="success">{successMessage}</Alert>
      )}
    </div>
  );
};

export default Notification;
