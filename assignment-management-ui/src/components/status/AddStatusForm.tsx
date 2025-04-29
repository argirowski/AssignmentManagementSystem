import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
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
    <Container>
      <h2>Add New Status</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formStatusDescription">
          <Form.Label>Status Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter status description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Status
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

export default AddStatusForm;
