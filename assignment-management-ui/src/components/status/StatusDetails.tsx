import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import axios from "axios";
import { Status } from "../../types/types";

const StatusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Status/${id}`
        );
        setStatus(response.data);
      } catch (error) {
        console.error("Error fetching status details:", error);
      }
    };

    fetchStatus();
  }, [id]);

  if (!status) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Status Details</Card.Title>
          <Card.Text>
            <strong>Description:</strong> {status.description}
          </Card.Text>
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => window.history.back()}>
          Go Back
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/statuses/${id}/edit`)}
        >
          Edit
        </Button>
      </div>
    </Container>
  );
};

export default StatusDetails;
