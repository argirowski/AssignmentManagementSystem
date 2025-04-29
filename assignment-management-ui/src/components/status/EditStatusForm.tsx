import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
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
    <Container>
      <h2>Edit Status</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formStatusDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter status description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EditStatusForm;
