import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, ButtonGroup } from "react-bootstrap";
import axios from "axios";

type Category = {
  id: number;
  name: string;
};

const CategoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Category/${id}`
        );
        setCategory(response.data);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    fetchCategory();
  }, [id]);

  if (!category) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Category Details</Card.Title>
          <Card.Text>
            <strong>Name:</strong> {category.name}
          </Card.Text>
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-between mt-2">
        <ButtonGroup className="mt-4" style={{ gap: "1rem" }}>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/categories/${id}/edit`)}
          >
            Edit
          </Button>
        </ButtonGroup>
      </div>
    </Container>
  );
};

export default CategoryDetails;
