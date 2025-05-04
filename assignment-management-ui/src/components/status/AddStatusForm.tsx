import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddStatusForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5088/api/Status", { description });
      navigate("/statuses");
    } catch (error) {
      console.error("Error adding status:", error);
    }
  };

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Add New Status</h2>
          <Form onSubmit={handleSubmit} className="mt-4 text-start">
            <Form.Group className="mb-3" controlId="formStatusDescription">
              <Form.Label>
                <strong>Description</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter status description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
          style={{ maxWidth: "10rem" }}
          onClick={handleSubmit}
        >
          Add Status
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

export default AddStatusForm;
