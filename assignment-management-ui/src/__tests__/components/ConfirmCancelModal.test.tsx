import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";

describe("ConfirmCancelModal", () => {
  it("renders and displays the modal when show is true", () => {
    render(
      <ConfirmCancelModal
        show={true}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByText(/Confirm Cancel/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to cancel/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /No/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Yes$/i })).toBeInTheDocument();
  });

  it("does not render modal content when show is false", () => {
    render(
      <ConfirmCancelModal
        show={false}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.queryByText(/Confirm Cancel/i)).not.toBeInTheDocument();
  });

  it("calls onCancel when No is clicked", () => {
    const onCancel = jest.fn();
    render(
      <ConfirmCancelModal
        show={true}
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /No/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onConfirm when Yes is clicked", () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmCancelModal
        show={true}
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /^Yes$/i }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
