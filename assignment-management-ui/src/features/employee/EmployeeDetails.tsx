import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../store";
import { fetchEmployeeByIdAction } from "../../redux/employee/employeeActions";
import LoadingSpinner from "../../components/LoadingSpinner";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { employees, loading, error } = useSelector(
    (state: AppState) => state.employees
  );
  const employee = employees.length > 0 ? employees[0] : null;

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeByIdAction(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!employee) {
    return <LoadingSpinner />;
  }

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Employee Details</Card.Title>
          <Card.Text>
            <strong>Full Name:</strong> {employee.fullName}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {employee.email}
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
          onClick={() => navigate(`/employees/${id}/edit`)}
        >
          Edit
        </Button>
      </div>
    </Container>
  );
};

export default EmployeeDetails;
