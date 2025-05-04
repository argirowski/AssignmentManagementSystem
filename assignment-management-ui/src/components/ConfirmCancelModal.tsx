import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ConfirmCancelModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  show,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Cancel</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to cancel?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          No
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmCancelModal;
