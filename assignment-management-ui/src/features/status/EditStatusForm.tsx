import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchStatusById, updateStatus } from "../../utils/api/statusApi";
import { Status } from "../../types/types";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { statusSchema, StatusFormData } from "../../utils/validation";
import LoadingSpinner from "../../components/LoadingSpinner";

const EditStatusForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status | null>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: { description: "" },
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await fetchStatusById(id!);
        setStatus(data);
        reset({ description: data.description });
      } catch (error) {
        console.error("Error fetching status details:", error);
      }
    };

    fetchStatus();
  }, [id, reset]);

  const onSubmit = async (data: StatusFormData) => {
    try {
      await updateStatus(id!, {
        id: status?.id!,
        description: data.description,
      });
      navigate(`/statuses`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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

  if (!status) {
    return <LoadingSpinner />;
  }

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Edit Status</h2>
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
            <Button
              variant="primary"
              size="lg"
              style={{ maxWidth: "10rem" }}
              type="submit"
            >
              Save
            </Button>
            <Button
              variant="secondary"
              size="lg"
              style={{ maxWidth: "10rem", marginLeft: "1rem" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ConfirmCancelModal
        show={showModal}
        onConfirm={confirmCancel}
        onCancel={closeModal}
      />
    </Container>
  );
};

export default EditStatusForm;
