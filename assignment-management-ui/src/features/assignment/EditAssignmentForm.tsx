import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Assignment, Category, Employee, Status } from "../../types/types";
import LoadingSpinner from "../../components/LoadingSpinner";

const EditAssignmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [statusId, setStatusId] = useState<number | "">("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Assignment/${id}`
        );
        const data = response.data;
        setAssignment(data);
        setTitle(data.title);
        setDescription(data.description);
        setIsCompleted(data.isCompleted);
        setEmployeeId(data.employeeId);
        setStatusId(data.statusId);
        setCategoryIds(data.categoryIds);
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
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5088/api/Assignment/${id}`, {
        title,
        description,
        isCompleted,
        employeeId,
        statusId,
        categoryIds,
      });
      navigate(`/assignments`);
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  if (!assignment) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <h2>Edit Assignment</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formAssignmentTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formAssignmentDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter assignment description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formAssignmentIsCompleted">
          <Form.Check
            type="checkbox"
            label="Completed"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formAssignmentEmployee">
          <Form.Label>Employee</Form.Label>
          <Form.Select
            value={employeeId}
            onChange={(e) => setEmployeeId(Number(e.target.value))}
            disabled={!employees.length}
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formAssignmentStatus">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={statusId}
            onChange={(e) => setStatusId(Number(e.target.value))}
            disabled={!statuses.length}
          >
            <option value="">Select a status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.description}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formAssignmentCategories">
          <Form.Label>Categories</Form.Label>
          <Form.Select
            multiple
            value={categoryIds.map(String)}
            onChange={(e) =>
              setCategoryIds(
                Array.from(e.target.selectedOptions, (option) =>
                  Number(option.value)
                )
              )
            }
            disabled={!categories.length}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group> */}
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EditAssignmentForm;
