import React, { useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { fetchCategoryByIdAction } from "../../redux/category/categoryActions";
import NotFoundComponent from "../../components/NotFoundComponent";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import WithLoadingAndError from "../../components/WithLoadingAndError";

const CategoryDetails: React.FC = () => {
  const {
    dispatch,
    navigate,
    params: { id },
  } = useCommonHooks();

  const { categories, loading, error } = useSelector(
    (state: AppState) => state.categories
  );
  const category = categories.length > 0 ? categories[0] : null;

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryByIdAction(id));
    }
  }, [dispatch, id]);

  return (
    <WithLoadingAndError loading={loading} error={error}>
      {category ? (
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
      ) : (
        <NotFoundComponent message="Category not found." />
      )}
    </WithLoadingAndError>
  );
};

export default CategoryDetails;
