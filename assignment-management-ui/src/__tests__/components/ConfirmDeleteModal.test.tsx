import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

describe("ConfirmDeleteModal", () => {
  it("renders and displays the modal when show is true", () => {
    render(
      <ConfirmDeleteModal
        show={true}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByText(/Confirm Delete/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /No/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Yes, Delete/i })
    ).toBeInTheDocument();
  });

  it("does not render modal content when show is false", () => {
    render(
      <ConfirmDeleteModal
        show={false}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.queryByText(/Confirm Delete/i)).not.toBeInTheDocument();
  });

  it("calls onCancel when No is clicked", () => {
    const onCancel = jest.fn();
    render(
      <ConfirmDeleteModal
        show={true}
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /No/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onConfirm when Yes, Delete is clicked", () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmDeleteModal
        show={true}
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Yes, Delete/i }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
