import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { addCategoryAction } from "../../redux/category/categoryActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { categorySchema, CategoryFormData } from "../../utils/validation";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import {
  confirmCancel,
  closeModal,
  handleCancel as reusableHandleCancel,
} from "../../utils/modalHelpers";

const AddCategoryForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const [showModal, setShowModal] = useState(false);
  const { dispatch, navigate } = useCommonHooks();

  const handleCancel = () =>
    reusableHandleCancel(isDirty, setShowModal, navigate);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await dispatch(addCategoryAction(data.name));
      navigate("/categories");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Add New Category</h2>
          <Form className="mt-4 text-start" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formCategoryName">
              <Form.Label>
                <strong>Category Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                {...register("name")}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div
              className="d-flex justify-content-start mt-2"
              style={{ gap: "1rem" }}
            >
              <Button
                variant="primary"
                type="submit"
                size="lg"
                style={{ maxWidth: "10rem" }}
              >
                Add Category
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
          </Form>
        </Card.Body>
      </Card>
      <ConfirmCancelModal
        show={showModal}
        onConfirm={() => confirmCancel(setShowModal, navigate)}
        onCancel={() => closeModal(setShowModal, () => {})}
      />
    </Container>
  );
};

export default AddCategoryForm;
