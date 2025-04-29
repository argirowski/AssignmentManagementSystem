import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Status = {
  id: number;
  description: string;
};

const Statuses: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get("http://localhost:5088/api/Status");
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, []);

  return (
    <Container>
      <div className="statuses">
        <h2>Statuses</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map(({ id, description }) => (
              <tr key={id}>
                <td>{description}</td>
                <td>
                  <Button
                    variant="success me-2"
                    onClick={() => navigate(`/statuses/${id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="warning me-2"
                    onClick={() => navigate(`/statuses/${id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button variant="danger me-2">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Statuses;
