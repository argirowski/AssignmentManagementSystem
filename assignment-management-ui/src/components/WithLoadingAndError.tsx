import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorComponent from "./ErrorComponent";
import NotFoundComponent from "./NotFoundComponent";
import { WithLoadingAndErrorProps } from "../types/types";

interface Props extends WithLoadingAndErrorProps {
  notFound?: boolean;
  notFoundMessage?: string;
}

const WithLoadingAndError: React.FC<Props> = ({
  loading,
  error,
  notFound,
  notFoundMessage,
  children,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (notFound) {
    return <NotFoundComponent message={notFoundMessage || "Not found."} />;
  }

  return <>{children}</>;
};

export default WithLoadingAndError;
