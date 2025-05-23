import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addEmployeeAction } from "../../redux/employee/employeeActions";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { employeeSchema, EmployeeFormData } from "../../utils/validation";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import {
  confirmCancel,
  closeModal,
  handleCancel as reusableHandleCancel,
} from "../../utils/modalHelpers";

const AddEmployeeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { fullName: "", email: "" },
  });

  const [showModal, setShowModal] = useState(false);
  const { dispatch, navigate } = useCommonHooks();

  const handleCancel = () =>
    reusableHandleCancel(isDirty, setShowModal, navigate);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await dispatch(addEmployeeAction({ ...data }));
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
        onConfirm={() => confirmCancel(setShowModal, navigate)}
        onCancel={() => closeModal(setShowModal, () => {})}
      />
    </Container>
  );
};

export default AddEmployeeForm;
