import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../../components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders spinner and loading text", () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
