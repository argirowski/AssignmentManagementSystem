import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployeeForm: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5088/api/Employee", {
        fullName,
        email,
      });
      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Add New Employee</h2>
          <Form onSubmit={handleSubmit} className="mt-4 text-start">
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
          type="submit"
          style={{ maxWidth: "15rem" }}
          onClick={handleSubmit}
        >
          Add Employee
        </Button>
        <Button
          variant="secondary"
          size="lg"
          style={{ maxWidth: "15rem" }}
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </div>
    </Container>
  );
};

export default AddEmployeeForm;
