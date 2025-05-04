import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addEmployee } from "../../api/employeeApi";
import ConfirmCancelModal from "../ConfirmCancelModal";

const schema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .max(50, "Full Name must be less than 50 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(50, "Email must be less than 50 characters"),
});

type FormData = z.infer<typeof schema>;

const AddEmployeeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "" },
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
      await addEmployee({ ...data });
      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Add New Employee</h2>
          <Form onSubmit={handleSubmit(onSubmit)} className="mt-4 text-start">
            <Form.Group className="mb-3" controlId="formEmployeeFullName">
              <Form.Label>
                <strong>Full Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee full name"
                {...register("fullName")}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmployeeEmail">
              <Form.Label>
                <strong>Email</strong>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter employee email"
                {...register("email")}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
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
          style={{ maxWidth: "15rem" }}
          onClick={handleSubmit(onSubmit)}
        >
          Add Employee
        </Button>
        <Button
          variant="secondary"
          size="lg"
          style={{ maxWidth: "15rem" }}
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

export default AddEmployeeForm;
