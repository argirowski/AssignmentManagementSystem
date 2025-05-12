import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppState, AppDispatch } from "../../store";
import LoadingSpinner from "../../components/LoadingSpinner";
import { fetchCategoryByIdAction } from "../../redux/category/categoryActions";
import ErrorComponent from "../../components/ErrorComponent";
import NotFoundComponent from "../../components/NotFoundComponent";

const CategoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading, error } = useSelector(
    (state: AppState) => state.categories
  );
  const category = categories.length > 0 ? categories[0] : null;

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryByIdAction(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (!category) {
    return <NotFoundComponent message="Category not found." />;
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
