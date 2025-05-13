import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import {
  fetchCategoryByIdAction,
  updateCategoryAction,
} from "../../redux/category/categoryActions";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { categorySchema, CategoryFormData } from "../../utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import NotFoundComponent from "../../components/NotFoundComponent";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import WithLoadingAndError from "../../components/WithLoadingAndError";
import {
  closeModal,
  confirmCancel,
  handleCancel as reusableHandleCancel,
} from "../../utils/modalHelpers";

const EditCategoryForm: React.FC = () => {
  const {
    dispatch,
    navigate,
    params: { id },
  } = useCommonHooks();
  const { categories, loading, error } = useSelector(
    (state: AppState) => state.categories
  );
  const category = categories.length > 0 ? categories[0] : null;
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name || "" },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryByIdAction(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (category) {
      reset({ name: category.name });
    }
  }, [category, reset]);

  const handleCancel = () =>
    reusableHandleCancel(isDirty, setShowModal, navigate);

  const onSubmit = async (data: CategoryFormData) => {
    console.log("Submitting data:", { id: category?.id, name: data.name });
    try {
      await dispatch(
        updateCategoryAction(id!, {
          id: category?.id!,
          name: data.name,
        })
      );
      navigate(`/categories`);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <WithLoadingAndError loading={loading} error={error}>
      {category ? (
        <Container
          style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
        >
          <Card className="mt-4">
            <Card.Body>
              <h2 className="text-start">Edit Category</h2>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 text-start"
              >
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
        <NotFoundComponent message="Category not found." />
      )}
    </WithLoadingAndError>
  );
};

export default EditCategoryForm;
