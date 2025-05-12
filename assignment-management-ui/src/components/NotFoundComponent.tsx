import React from "react";
import { Alert } from "react-bootstrap";

type NotFoundComponentProps = {
  message: string;
};

const NotFoundComponent: React.FC<NotFoundComponentProps> = ({ message }) => {
  return (
    <Alert variant="warning" className="text-center">
      <strong>Not Found:</strong> {message}
    </Alert>
  );
};

export default NotFoundComponent;
