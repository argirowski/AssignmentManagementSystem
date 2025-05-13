import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorComponent from "./ErrorComponent";
import { WithLoadingAndErrorProps } from "../types/types";

const WithLoadingAndError: React.FC<WithLoadingAndErrorProps> = ({
  loading,
  error,
  children,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return <>{children}</>;
};

export default WithLoadingAndError;
