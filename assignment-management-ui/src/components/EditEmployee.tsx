import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";

type Employee = {
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
};

const EditEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Employee/${id}`
        );
        setEmployee(response.data);
        setName(response.data.name);
        setPosition(response.data.position);
        setDepartment(response.data.department);
        setEmail(response.data.email);
        setPhone(response.data.phone);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5088/api/Employee/${id}`, {
        name,
        position,
        department,
        email,
        phone,
      });
      navigate(`/employees`);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  if (!employee) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <h2>Edit Employee</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formEmployeeName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter employee name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmployeePosition">
          <Form.Label>Position</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter employee position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmployeeDepartment">
          <Form.Label>Department</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter employee department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmployeeEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter employee email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmployeePhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter employee phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>
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

export default EditEmployee;
