import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { CreateAssignment } from "../../types/types";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { assignmentSchema } from "../../utils/validation";
import {
  closeModal,
  confirmCancel,
  handleCancel as reusableHandleCancel,
} from "../../utils/modalHelpers";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import { useSelector } from "react-redux";
import {
  fetchAssignmentByIdAction,
  updateAssignmentAction,
} from "../../redux/assignment/assignmentActions";
import { AppState } from "../../store";
import { fetchEmployeesAction } from "../../redux/employee/employeeActions";
import { fetchStatusesAction } from "../../redux/status/statusActions";
import { fetchCategoriesAction } from "../../redux/category/categoryActions";
import WithLoadingAndError from "../../components/WithLoadingAndError";

const EditAssignmentForm: React.FC = () => {
  const {
    navigate,
    dispatch,
    params: { id },
  } = useCommonHooks();

  const employees = useSelector((state: AppState) => state.employees.employees);
  const statuses = useSelector((state: AppState) => state.statuses.statuses);
  const categories = useSelector(
    (state: AppState) => state.categories.categories
  );

  const {
    assignmentDetails: assignment,
    loading,
    error,
  } = useSelector((state: AppState) => state.assignments);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateAssignment>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      isCompleted: false,
      employeeId: "",
      statusId: "",
      categoryIds: [],
    },
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAssignmentByIdAction(id));
      dispatch(fetchEmployeesAction());
      dispatch(fetchStatusesAction());
      dispatch(fetchCategoriesAction());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (assignment) {
      reset({
        title: assignment.title,
        description: assignment.description,
        isCompleted: assignment.isCompleted,
        employeeId: assignment.employee.fullName, // Use fullName from NewEmployee
        statusId: assignment.status.description, // Use a valid property from StatusFormData
        categoryIds: assignment.categories.map(
          (category) => category.name // Use a valid property from NewCategory
        ),
      });
    }
  }, [assignment, reset]);

  const handleCancel = () =>
    reusableHandleCancel(isDirty, setShowModal, navigate);

  const onSubmit = async (data: CreateAssignment) => {
    if (id) {
      dispatch(updateAssignmentAction(id, data));
      navigate(`/assignments`);
    } else {
      console.error("Assignment ID is missing.");
    }
  };

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

  const handleEmployeeDropdownClick = () => {
    if (employees.length === 0) {
      dispatch(fetchEmployeesAction());
    }
  };

  const handleStatusDropdownClick = () => {
    if (statuses.length === 0) {
      dispatch(fetchStatusesAction());
    }
  };

  const handleCategoryDropdownOpen = () => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesAction());
    }
  };

  return (
    <WithLoadingAndError
      loading={loading}
      error={error}
      notFound={!assignment}
      notFoundMessage="Assignment not found."
    >
      {assignment && (
        <Container
          style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
        >
          <Card className="mt-4">
            <Card.Body>
              <h2 className="text-start">Edit Assignment</h2>
              <Form
                className="mt-4 text-start"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Form.Group controlId="formTitle" className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter assignment title"
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
                    placeholder="Enter assignment description"
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
                    onMenuOpen={handleCategoryDropdownOpen} // Trigger fetch on menu open
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
                    onClick={handleEmployeeDropdownClick} // Trigger fetch on click
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
                    onClick={handleStatusDropdownClick} // Trigger fetch on click
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
      )}
    </WithLoadingAndError>
  );
};

export default EditAssignmentForm;
