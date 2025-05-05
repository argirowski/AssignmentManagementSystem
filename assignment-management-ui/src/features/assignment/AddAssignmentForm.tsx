import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchCategories } from "../../utils/api/categoryApi";
import { fetchEmployees } from "../../utils/api/employeeApi";
import { fetchStatuses } from "../../utils/api/statusApi";
import { Category, Status, CreateAssignment } from "../../types/types";
import { addAssignment } from "../../utils/api/assignmentApi";
import Select from "react-select";
import { assignmentSchema } from "../../utils/validation";

interface Employee {
  id: string;
  fullName: string;
}

const AddAssignmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = (await fetchCategories()).map(
          (category: any) => ({
            id: category.id.toString(),
            name: category.name,
          })
        );

        const employeesData = (await fetchEmployees()).map((employee: any) => ({
          id: employee.id.toString(),
          fullName: employee.fullName,
        }));

        const statusesData = (await fetchStatuses()).map((status: any) => ({
          id: status.id.toString(),
          description: status.description,
        }));

        setCategories(categoriesData);
        setEmployees(employeesData);
        setStatuses(statusesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: CreateAssignment) => {
    try {
      await addAssignment({
        title: data.title,
        description: data.description,
        isCompleted: data.isCompleted,
        categoryIds: data.categoryIds,
        employeeId: data.employeeId,
        statusId: data.statusId,
      });
      navigate("/assignments");
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

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
                {...register("categoryIds")}
                onChange={(selectedOptions) => {
                  const values = selectedOptions.map((option) =>
                    option.value.toString()
                  );
                  setValue("categoryIds", values);
                }}
                placeholder="Select categories..."
              />
              <Form.Control.Feedback type="invalid">
                {errors.categoryIds?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmployee" className="mb-3">
              <Form.Label>Employee</Form.Label>
              <Form.Control
                as="select"
                {...register("employeeId")}
                isInvalid={!!errors.employeeId}
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
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddAssignmentForm;
