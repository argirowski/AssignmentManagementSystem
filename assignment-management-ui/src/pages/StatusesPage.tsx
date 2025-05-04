import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Status } from "../types/types";
import { fetchStatuses, deleteStatus } from "../utils/api/statusApi";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const StatusesPage: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<number | null>(null);

  useEffect(() => {
    const getStatuses = async () => {
      try {
        const data = await fetchStatuses();
        setStatuses(data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    getStatuses();
  }, []);

  const handleDelete = (id: number) => {
    setStatusToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (statusToDelete !== null) {
      try {
        await deleteStatus(statusToDelete);
        setStatuses((prevStatuses) =>
          prevStatuses.filter((status) => status.id !== statusToDelete)
        );
      } catch (error) {
        console.error("Error deleting status:", error);
      } finally {
        setShowModal(false);
        setStatusToDelete(null);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setStatusToDelete(null);
  };

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
                  <Button
                    variant="danger me-2"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-4 text-start">
          <p>
            Want to add a new status? <Link to="/statuses/new">Click here</Link>
          </p>
        </div>
      </div>
      <ConfirmDeleteModal
        show={showModal}
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />
    </Container>
  );
};

export default StatusesPage;
