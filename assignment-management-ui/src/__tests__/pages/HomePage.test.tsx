import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../../pages/HomePage";

describe("HomePage", () => {
  it("renders welcome message", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/Welcome to my Assignment app/i)
    ).toBeInTheDocument();
  });

  it("renders assignments link with correct href and classes", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /View Assignments/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/assignments");
    expect(link).toHaveClass("btn btn-primary btn-lg");
  });
});
