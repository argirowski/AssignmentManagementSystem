import React from "react";
import { Alert } from "react-bootstrap";
import { ErrorComponentProps } from "../types/types";

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
  return (
    <Alert variant="danger" className="text-center">
      <strong>Error:</strong> {message}
    </Alert>
  );
};

export default ErrorComponent;
