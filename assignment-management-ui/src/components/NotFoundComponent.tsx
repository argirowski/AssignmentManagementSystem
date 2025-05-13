import React from "react";
import { Alert } from "react-bootstrap";
import { NotFoundComponentProps } from "../types/types";

const NotFoundComponent: React.FC<NotFoundComponentProps> = ({ message }) => {
  return (
    <Alert variant="warning" className="text-center">
      <h4>Page Not Found!</h4>
      <strong>Not Found:</strong> {message}
    </Alert>
  );
};

export default NotFoundComponent;
