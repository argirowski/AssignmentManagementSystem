import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";

type Employee = {
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
};

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Employee/${id}`
        );
        setEmployee(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Employee Details</Card.Title>
          <Card.Text>
            <strong>Name:</strong> {employee.name}
          </Card.Text>
          <Card.Text>
            <strong>Position:</strong> {employee.position}
          </Card.Text>
          <Card.Text>
            <strong>Department:</strong> {employee.department}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {employee.email}
          </Card.Text>
          <Card.Text>
            <strong>Phone:</strong> {employee.phone}
          </Card.Text>
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => window.history.back()}>
          Go Back
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/employees/${id}/edit`)}
        >
          Edit
        </Button>
      </div>
    </Container>
  );
};

export default EmployeeDetails;
