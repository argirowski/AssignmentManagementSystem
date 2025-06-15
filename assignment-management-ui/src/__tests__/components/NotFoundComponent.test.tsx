import React from "react";
import { render, screen } from "@testing-library/react";
import NotFoundComponent from "../../components/NotFoundComponent";

describe("NotFoundComponent", () => {
  it("renders not found message", () => {
    render(<NotFoundComponent message="Test not found" />);
    expect(screen.getByText(/Page Not Found!/i)).toBeInTheDocument();
    expect(screen.getByText(/Not Found:/i)).toBeInTheDocument();
    expect(screen.getByText(/Test not found/i)).toBeInTheDocument();
  });
});
