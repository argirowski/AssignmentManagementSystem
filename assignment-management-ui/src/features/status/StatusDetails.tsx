import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppState, AppDispatch } from "../../store";
import LoadingSpinner from "../../components/LoadingSpinner";
import { fetchStatusByIdAction } from "../../redux/status/statusActions";

const StatusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { statuses, loading, error } = useSelector(
    (state: AppState) => state.statuses
  );
  const status = statuses.length > 0 ? statuses[0] : null;

  useEffect(() => {
    if (id) {
      dispatch(fetchStatusByIdAction(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!status) {
    return <p>Status not found.</p>;
  }

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Status Details</Card.Title>
          <Card.Text>
            <strong>Description:</strong> {status.description}
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
          onClick={() => navigate(`/statuses/${id}/edit`)}
        >
          Edit
        </Button>
      </div>
    </Container>
  );
};

export default StatusDetails;
