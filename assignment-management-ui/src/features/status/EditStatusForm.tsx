import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { StatusFormData } from "../../types/types";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { statusSchema } from "../../utils/validation";
import {
  fetchStatusByIdAction,
  updateStatusAction,
} from "../../redux/status/statusActions";
import NotFoundComponent from "../../components/NotFoundComponent";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import WithLoadingAndError from "../../components/WithLoadingAndError";
import {
  closeModal,
  confirmCancel,
  handleCancel as reusableHandleCancel,
} from "../../utils/modalHelpers";

const EditStatusForm: React.FC = () => {
  const {
    dispatch,
    navigate,
    params: { id },
  } = useCommonHooks();
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

  const handleCancel = () =>
    reusableHandleCancel(isDirty, setShowModal, navigate);

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

  return (
    <WithLoadingAndError loading={loading} error={error}>
      {status ? (
        <Container
          style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
        >
          <Card className="mt-4">
            <Card.Body>
              <h2 className="text-start">Edit Status</h2>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 text-start"
              >
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
            onConfirm={() => confirmCancel(setShowModal, navigate)}
            onCancel={() => closeModal(setShowModal, () => {})}
          />
        </Container>
      ) : (
        <NotFoundComponent message="Status not found." />
      )}
    </WithLoadingAndError>
  );
};

export default EditStatusForm;
