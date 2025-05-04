import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addStatus } from "../../api/statusApi";
import ConfirmCancelModal from "../ConfirmCancelModal";

const schema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description must be less than 100 characters"),
});

type FormData = z.infer<typeof schema>;

const AddStatusForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { description: "" },
  });

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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

  const onSubmit = async (data: FormData) => {
    try {
      await addStatus(data.description);
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
