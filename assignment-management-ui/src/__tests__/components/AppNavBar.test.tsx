import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppNavBar from "../../components/AppNavBar";

describe("AppNavBar", () => {
  it("renders the brand and all navigation links", () => {
    render(
      <MemoryRouter>
        <AppNavBar />
      </MemoryRouter>
    );
    expect(screen.getByText("Assignment App")).toBeInTheDocument();
    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("Assignments")).toBeInTheDocument();
    expect(screen.getByText("Statuses")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });

  it("brand links to home", () => {
    render(
      <MemoryRouter>
        <AppNavBar />
      </MemoryRouter>
    );
    const brandLink = screen.getByRole("link", { name: "Assignment App" });
    expect(brandLink).toHaveAttribute("href", "/");
  });

  it("navigation links have correct hrefs", () => {
    render(
      <MemoryRouter>
        <AppNavBar />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: "Employees" })).toHaveAttribute(
      "href",
      "/employees"
    );
    expect(screen.getByRole("link", { name: "Assignments" })).toHaveAttribute(
      "href",
      "/assignments"
    );
    expect(screen.getByRole("link", { name: "Statuses" })).toHaveAttribute(
      "href",
      "/statuses"
    );
    expect(screen.getByRole("link", { name: "Categories" })).toHaveAttribute(
      "href",
      "/categories"
    );
  });
});
