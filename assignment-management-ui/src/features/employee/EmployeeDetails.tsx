import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Employee } from "../../types/types";
import { fetchEmployeeById } from "../../utils/api/employeeApi";
import LoadingSpinner from "../../components/LoadingSpinner";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await fetchEmployeeById(id!);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployee();
  }, [id]);

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
