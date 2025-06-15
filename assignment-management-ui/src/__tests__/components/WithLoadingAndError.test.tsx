import React from "react";
import { render, screen } from "@testing-library/react";
import WithLoadingAndError from "../../components/WithLoadingAndError";

jest.mock("../../components/LoadingSpinner", () => () => (
  <div data-testid="spinner">Loading...</div>
));
jest.mock(
  "../../components/ErrorComponent",
  () =>
    ({ message }: { message: string }) =>
      <div data-testid="error">Error: {message}</div>
);
jest.mock(
  "../../components/NotFoundComponent",
  () =>
    ({ message }: { message: string }) =>
      <div data-testid="notfound">Not Found: {message}</div>
);

describe("WithLoadingAndError", () => {
  it("renders spinner when loading", () => {
    render(
      <WithLoadingAndError loading={true} error={null}>
        children
      </WithLoadingAndError>
    );
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders error when error is present", () => {
    render(
      <WithLoadingAndError loading={false} error="Test error">
        children
      </WithLoadingAndError>
    );
    expect(screen.getByTestId("error")).toHaveTextContent("Error: Test error");
  });

  it("renders not found when notFound is true", () => {
    render(
      <WithLoadingAndError
        loading={false}
        error={null}
        notFound={true}
        notFoundMessage="Not here"
      >
        children
      </WithLoadingAndError>
    );
    expect(screen.getByTestId("notfound")).toHaveTextContent(
      "Not Found: Not here"
    );
  });

  it("renders children when no loading, error, or notFound", () => {
    render(
      <WithLoadingAndError loading={false} error={null}>
        Test Child
      </WithLoadingAndError>
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
