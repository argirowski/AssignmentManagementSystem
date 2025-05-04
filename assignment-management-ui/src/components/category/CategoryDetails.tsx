import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { Category } from "../../types/types";
import { fetchCategoryById } from "../../api/categoryApi";

const CategoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await fetchCategoryById(id!);
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    getCategory();
  }, [id]);

  if (!category) {
    return <p>Loading...</p>;
  }

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Category Details</Card.Title>
          <Card.Text>
            <strong>Name:</strong> {category.name}
          </Card.Text>
        </Card.Body>
      </Card>

      <div
        className="d-flex justify-content-start mt-2"
        style={{ gap: "1rem" }}
      >
        <Button
          variant="secondary"
          size="lg"
          style={{ maxWidth: "10rem" }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          style={{ maxWidth: "10rem" }}
          onClick={() => navigate(`/categories/${id}/edit`)}
        >
          Edit
        </Button>
      </div>
    </Container>
  );
};

export default CategoryDetails;
