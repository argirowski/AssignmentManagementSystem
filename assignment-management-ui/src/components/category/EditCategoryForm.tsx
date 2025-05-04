import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { fetchCategoryById, updateCategory } from "../../api/categoryApi";
import { Category } from "../../types/types";
import {
  categorySchema,
  CategoryFormData,
} from "../../validation/categoryValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ConfirmCancelModal from "../ConfirmCancelModal";

const EditCategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const navigate = useNavigate();
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
    const fetchCategory = async () => {
      try {
        const data = await fetchCategoryById(id!);
        setCategory(data);
        reset({ name: data.name });
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    fetchCategory();
  }, [id, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    console.log("Submitting data:", { id: category?.id, name: data.name }); // Log the data being sent
    try {
      await updateCategory(id!, { id: category?.id!, name: data.name });
      navigate(`/categories`);
    } catch (error) {
      console.error("Error updating category:", error);
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

  if (!category) {
    return <p>Loading...</p>;
  }

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Edit Category</h2>
          <Form onSubmit={handleSubmit(onSubmit)} className="mt-4 text-start">
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
        onConfirm={confirmCancel}
        onCancel={closeModal}
      />
    </Container>
  );
};

export default EditCategoryForm;
