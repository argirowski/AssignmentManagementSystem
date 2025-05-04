import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { Status } from "../../types/types";
import { fetchStatusById } from "../../utils/api/statusApi";

const StatusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await fetchStatusById(id!);
        setStatus(data);
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
