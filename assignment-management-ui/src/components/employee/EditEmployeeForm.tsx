import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { Employee } from "../../types/types";

const EditEmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Employee/${id}`
        );
        setEmployee(response.data);
        setFullName(response.data.fullName);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5088/api/Employee/${id}`, {
        fullName,
        email,
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
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Edit Employee</h2>
          <Form className="mt-4 text-start">
            <Form.Group className="mb-3" controlId="formEmployeeFullName">
              <Form.Label>
                <strong>Full Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmployeeEmail">
              <Form.Label>
                <strong>Email</strong>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter employee email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
          style={{ maxWidth: "10rem" }}
          onClick={handleSave}
        >
          Save
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
    </Container>
  );
};

export default EditEmployeeForm;
