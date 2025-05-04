import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategoryForm: React.FC = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5088/api/Category", { name });
      navigate("/categories");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Add New Category</h2>
          <Form onSubmit={handleSubmit} className="mt-4 text-start">
            <Form.Group className="mb-3" controlId="formCategoryName">
              <Form.Label>
                <strong>Category Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
          type="submit"
          size="lg"
          style={{ maxWidth: "10rem" }}
          onClick={handleSubmit}
        >
          Add Category
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

export default AddCategoryForm;
