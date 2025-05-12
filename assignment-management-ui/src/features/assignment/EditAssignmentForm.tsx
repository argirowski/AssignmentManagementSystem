import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Category, Employee, Status } from "../../types/types";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmCancelModal from "../../components/ConfirmCancelModal";
import { assignmentSchema } from "../../utils/validation";

interface EditAssignmentFormFields {
  title: string;
  description: string;
  isCompleted: boolean;
  employeeId: string;
  statusId: string;
  categoryIds: string[];
}

const EditAssignmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<EditAssignmentFormFields>({
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

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Assignment/${id}`
        );
        const data = response.data;
        reset({
          title: data.title,
          description: data.description,
          isCompleted: data.isCompleted,
          employeeId: data.employee.id,
          statusId: data.status.id,
          categoryIds: data.categories.map(
            (category: { id: string }) => category.id
          ),
        });
      } catch (error) {
        console.error("Error fetching assignment details:", error);
      }
    };

    const fetchDependencies = async () => {
      try {
        const [employeesResponse, statusesResponse, categoriesResponse] =
          await Promise.all([
            axios.get("http://localhost:5088/api/Employee"),
            axios.get("http://localhost:5088/api/Status"),
            axios.get("http://localhost:5088/api/Category"),
          ]);
        setEmployees(employeesResponse.data);
        setStatuses(statusesResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching dependencies:", error);
      }
    };

    fetchAssignment();
    fetchDependencies();
  }, [id, reset]);

  const onSubmit = async (data: EditAssignmentFormFields) => {
    try {
      await axios.put(`http://localhost:5088/api/Assignment/${id}`, data);
      navigate(`/assignments`);
    } catch (error) {
      console.error("Error updating assignment:", error);
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

  return (
    <Container>
      <h2>Edit Assignment</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formAssignmentTitle">
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

        <Form.Group className="mb-3" controlId="formAssignmentDescription">
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

        <Form.Group className="mb-3" controlId="formAssignmentIsCompleted">
          <Form.Check
            type="checkbox"
            label="Completed"
            {...register("isCompleted")}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAssignmentEmployee">
          <Form.Label>Employee</Form.Label>
          <Form.Select
            {...register("employeeId")}
            isInvalid={!!errors.employeeId}
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.employeeId?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAssignmentStatus">
          <Form.Label>Status</Form.Label>
          <Form.Select {...register("statusId")} isInvalid={!!errors.statusId}>
            <option value="">Select a status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.description}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.statusId?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAssignmentCategories">
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

        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="secondary" className="ms-2" onClick={handleCancel}>
          Cancel
        </Button>
      </Form>

      <ConfirmCancelModal
        show={showModal}
        onConfirm={confirmCancel}
        onCancel={closeModal}
      />
    </Container>
  );
};

export default EditAssignmentForm;
