import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../store";
import { StatusFormData } from "../../types/types";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { statusSchema } from "../../utils/validation";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  fetchStatusByIdAction,
  updateStatusAction,
} from "../../redux/status/statusActions";
import ErrorComponent from "../../components/ErrorComponent";
import NotFoundComponent from "../../components/NotFoundComponent";

const EditStatusForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { statuses, loading, error } = useSelector(
    (state: AppState) => state.statuses
  );
  const status = statuses.length > 0 ? statuses[0] : null;
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
    if (id) {
      dispatch(fetchStatusByIdAction(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (status) {
      reset({ description: status.description });
    }
  }, [status, reset]);

  const onSubmit = async (data: StatusFormData) => {
    try {
      await dispatch(
        updateStatusAction(id!, {
          id: status?.id!,
          description: data.description,
        })
      );
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (!status) {
    return <NotFoundComponent message="Status not found." />;
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
