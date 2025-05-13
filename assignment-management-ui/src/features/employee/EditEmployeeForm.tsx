import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import {
  fetchEmployeeByIdAction,
  updateEmployeeAction,
} from "../../redux/employee/employeeActions";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { employeeSchema, EmployeeFormData } from "../../utils/validation";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorComponent from "../../components/ErrorComponent";
import NotFoundComponent from "../../components/NotFoundComponent";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import WithLoadingAndError from "../../components/WithLoadingAndError";

const EditEmployeeForm: React.FC = () => {
  const {
    dispatch,
    navigate,
    params: { id },
  } = useCommonHooks();
  const { employees, loading, error } = useSelector(
    (state: AppState) => state.employees
  );
  const employee = employees.length > 0 ? employees[0] : null;
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { fullName: "", email: "" },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeByIdAction(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (employee) {
      reset({ fullName: employee.fullName, email: employee.email });
    }
  }, [employee, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await dispatch(updateEmployeeAction(id!, { id: employee?.id!, ...data }));
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

  return (
    <WithLoadingAndError loading={loading} error={error}>
      {employee ? (
        <Container
          style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
        >
          <Card className="mt-4">
            <Card.Body>
              <h2 className="text-start">Edit Employee</h2>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 text-start"
              >
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
      ) : (
        <NotFoundComponent message="Employee not found." />
      )}
    </WithLoadingAndError>
  );
};

export default EditEmployeeForm;
