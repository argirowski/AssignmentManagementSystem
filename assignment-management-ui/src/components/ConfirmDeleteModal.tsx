import React from "react";
import { Modal, Button } from "react-bootstrap";
import { ConfirmDeleteModalProps } from "../types/types";

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          No
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
