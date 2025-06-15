import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorComponent from "../../components/ErrorComponent";

describe("ErrorComponent", () => {
  it("renders error message", () => {
    render(<ErrorComponent message="Test error" />);
    expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });
});
