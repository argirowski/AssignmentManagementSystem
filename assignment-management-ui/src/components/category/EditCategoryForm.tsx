import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { Category } from "../../types/types";

const EditCategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Category/${id}`
        );
        setCategory(response.data);
        setName(response.data.name);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5088/api/Category/${id}`, { name });
      navigate(`/categories`);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  if (!category) {
    return <p>Loading...</p>;
  }

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Edit Category</h2>
          <Form className="mt-4 text-start">
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

export default EditCategoryForm;
