import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";

type Category = {
  id: number;
  name: string;
};

const EditCategory: React.FC = () => {
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
    <Container>
      <h2>Edit Category</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formCategoryName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default EditCategory;
