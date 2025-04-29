import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import axios from "axios";

type Employee = {
  id: number;
  fullName: string;
  email: string;
};

type Status = {
  id: number;
  description: string;
};

type Category = {
  id: number;
  name: string;
};

type Assignment = {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  employee: Employee;
  status: Status;
  categories: Category[];
};

const AssignmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Assignment/${id}`
        );
        setAssignment(response.data);
      } catch (error) {
        console.error("Error fetching assignment details:", error);
      }
    };

    fetchAssignment();
  }, [id]);

  if (!assignment) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
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
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => window.history.back()}>
          Go Back
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/assignments/${id}/edit`)}
        >
          Edit
        </Button>
      </div>
    </Container>
  );
};

export default AssignmentDetails;
