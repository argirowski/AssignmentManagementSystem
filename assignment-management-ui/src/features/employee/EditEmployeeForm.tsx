import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { Employee } from "../../types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchEmployeeById, updateEmployee } from "../../utils/api/employeeApi";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { employeeSchema, EmployeeFormData } from "../../utils/validation";

const EditEmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { fullName: "", email: "" },
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await fetchEmployeeById(id!);
        setEmployee(data);
        reset({ fullName: data.fullName, email: data.email });
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployee();
  }, [id, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await updateEmployee(id!, { id: employee?.id!, ...data });
      navigate(`/employees`);
    } catch (error) {
      console.error("Error updating employee:", error);
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

  if (!employee) {
    return <p>Loading...</p>;
  }

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Edit Employee</h2>
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

export default EditEmployeeForm;
