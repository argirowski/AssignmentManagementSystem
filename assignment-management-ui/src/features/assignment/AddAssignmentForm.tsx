import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { fetchStatusesAction } from "../../redux/status/statusActions";
import { AppState } from "../../store";
import { CreateAssignment } from "../../types/types";
import { addAssignmentAction } from "../../redux/assignment/assignmentActions";
import Select from "react-select";
import { assignmentSchema } from "../../utils/validation";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { fetchEmployeesAction } from "../../redux/employee/employeeActions";
import { fetchCategoriesAction } from "../../redux/category/categoryActions";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import {
  confirmCancel,
  closeModal,
  handleCancel as reusableHandleCancel,
} from "../../utils/modalHelpers";

const AddAssignmentForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreateAssignment>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      isCompleted: false,
      categoryIds: [],
      employeeId: "",
      statusId: "",
    },
  });

  const [showModal, setShowModal] = useState(false);
  const { dispatch, navigate } = useCommonHooks();
  const statuses = useSelector((state: AppState) => state.statuses.statuses);
  const employees = useSelector((state: AppState) => state.employees.employees);
  const categories = useSelector(
    (state: AppState) => state.categories.categories
  );

  const handleCancel = () =>
    reusableHandleCancel(isDirty, setShowModal, navigate);
  const onSubmit = async (data: CreateAssignment) => {
    try {
      await dispatch(addAssignmentAction(data));
      navigate("/assignments");
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchCategoriesAction());
    dispatch(fetchStatusesAction());
    dispatch(fetchEmployeesAction());
  }, [dispatch]);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onCategoryChange = (selectedOptions: any) => {
    const values = selectedOptions.map((option: any) => option.value);
    setValue("categoryIds", values, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onEmployeeChange = (event: React.ChangeEvent<any>) => {
    if (event.target instanceof HTMLSelectElement) {
      setValue("employeeId", event.target.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onStatusChange = (event: React.ChangeEvent<any>) => {
    if (event.target instanceof HTMLSelectElement) {
      setValue("statusId", event.target.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Add New Assignment</h2>
          <Form className="mt-4 text-start" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                {...register("title")}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                {...register("description")}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formIsCompleted" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Completed"
                {...register("isCompleted")}
              />
            </Form.Group>

            <Form.Group controlId="formCategory" className="mb-3">
              <Form.Label>Categories</Form.Label>
              <Select
                isMulti
                options={categoryOptions}
                onChange={onCategoryChange}
                placeholder="Select categories..."
              />
              {errors.categoryIds && (
                <div className="invalid-feedback d-block">
                  {errors.categoryIds.message}
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="formEmployee" className="mb-3">
              <Form.Label>Employee</Form.Label>
              <Form.Control
                as="select"
                {...register("employeeId")}
                isInvalid={!!errors.employeeId}
                onChange={onEmployeeChange}
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.employeeId?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                {...register("statusId")}
                isInvalid={!!errors.statusId}
                onChange={onStatusChange}
              >
                <option value="">Select a status</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.description}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.statusId?.message}
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
                Submit
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

export default AddAssignmentForm;
