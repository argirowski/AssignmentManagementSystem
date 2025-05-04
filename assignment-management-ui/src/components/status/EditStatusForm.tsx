import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { Status } from "../../types/types";

const EditStatusForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status | null>(null);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5088/api/Status/${id}`
        );
        setStatus(response.data);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Error fetching status details:", error);
      }
    };

    fetchStatus();
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5088/api/Status/${id}`, {
        description,
      });
      navigate(`/statuses`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!status) {
    return <p>Loading...</p>;
  }

  return (
    <Container
      style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
    >
      <Card className="mt-4">
        <Card.Body>
          <h2 className="text-start">Edit Status</h2>
          <Form className="mt-4 text-start">
            <Form.Group className="mb-3" controlId="formStatusDescription">
              <Form.Label>
                <strong>Description</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter status description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <div
        className="d-flex justify-content-start mt-2"
        style={{ gap: "1rem" }}
      >
        <Button
          variant="primary"
          size="lg"
          style={{ maxWidth: "10rem" }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="secondary"
          size="lg"
          style={{ maxWidth: "10rem" }}
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </div>
    </Container>
  );
};

export default EditStatusForm;
