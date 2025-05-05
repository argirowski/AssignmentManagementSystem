import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { fetchCategories } from "../../utils/api/categoryApi";
import { fetchEmployees } from "../../utils/api/employeeApi";
import { fetchStatuses } from "../../utils/api/statusApi";
import { Category, Status } from "../../types/types";

interface Employee {
  id: string;
  fullName: string;
}

const AddAssignmentForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      title,
      description,
      isCompleted,
      selectedCategory,
      selectedEmployee,
      selectedStatus,
    });
  };

  return (
    <Container>
      <h2>Add Assignment</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formIsCompleted" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Completed"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
        </Form.Group>

        <Form.Group controlId="formCategory" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formEmployee" className="mt-3">
          <Form.Label>Employee</Form.Label>
          <Form.Control
            as="select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formStatus" className="mt-3">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Select a status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.description}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default AddAssignmentForm;
