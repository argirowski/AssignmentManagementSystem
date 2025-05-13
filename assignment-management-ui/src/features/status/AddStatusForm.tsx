import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { statusSchema, StatusFormData } from "../../utils/validation";
import { addStatusAction } from "../../redux/status/statusActions";
import { useCommonHooks } from "../../hooks/useCommonHooks";

const AddStatusForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: { description: "" },
  });

  const [showModal, setShowModal] = useState(false);
  const { dispatch, navigate } = useCommonHooks();

  const handleCancel = () => {
    if (isDirty) {
      setShowModal(true);
    } else {
      navigate(-1);
    }
  };

  const confirmCancel = () => {
    setShowModal(false);
    navigate(-1);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onSubmit = async (data: StatusFormData) => {
    try {
      await dispatch(addStatusAction(data.description));
      navigate("/statuses");
    } catch (error) {
      console.error("Error adding status:", error);
    }
  };

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Add New Status</h2>
          <Form onSubmit={handleSubmit(onSubmit)} className="mt-4 text-start">
            <Form.Group className="mb-3" controlId="formStatusDescription">
              <Form.Label>
                <strong>Description</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter status description"
                {...register("description")}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <div
        className="d-flex justify-content-start mt-2"
        style={{ gap: "1rem" }}
      >
        <Button
          variant="primary"
          size="lg"
          type="submit"
          style={{ maxWidth: "10rem" }}
          onClick={handleSubmit(onSubmit)}
        >
          Add Status
        </Button>
        <Button
          variant="secondary"
          size="lg"
          style={{ maxWidth: "10rem" }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
      <ConfirmCancelModal
        show={showModal}
        onConfirm={confirmCancel}
        onCancel={closeModal}
      />
    </Container>
  );
};

export default AddStatusForm;
