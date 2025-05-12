import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignmentByIdAction } from "../../redux/assignment/assignmentActions";
import { AppState, AppDispatch } from "../../store";

const AssignmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const assignment = useSelector(
    (state: AppState) => state.assignments.assignmentDetails
  );
  const loading = useSelector((state: AppState) => state.assignments.loading);
  const error = useSelector((state: AppState) => state.assignments.error);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchAssignmentByIdAction(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!assignment) {
    return <div>No assignment found.</div>;
  }

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Assignment Details</Card.Title>
          <Card.Text>
            <strong>Title:</strong> {assignment.title}
          </Card.Text>
          <Card.Text>
            <strong>Description:</strong> {assignment.description}
          </Card.Text>
          <Card.Text>
            <strong>Completed:</strong> {assignment.isCompleted ? "Yes" : "No"}
          </Card.Text>
          <Card.Text>
            <strong>Created At:</strong>{" "}
            {new Date(assignment.createdAt).toLocaleDateString()}
          </Card.Text>
          <Card.Text>
            <strong>Employee:</strong> {assignment.employee.fullName} (
            {assignment.employee.email})
          </Card.Text>
          <Card.Text>
            <strong>Status:</strong> {assignment.status.description}
          </Card.Text>
          <Card.Text>
            <strong>Categories:</strong>{" "}
            {assignment.categories.map((category) => category.name).join(", ")}
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
          onClick={() => navigate(`/assignments/${id}/edit`)}
        >
          Edit
        </Button>
      </div>
    </Container>
  );
};

export default AssignmentDetails;
