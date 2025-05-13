import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AppState, AppDispatch } from "../store";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { Status } from "../types/types";
import {
  fetchStatusesAction,
  deleteStatusAction,
} from "../redux/status/statusActions";
import ErrorComponent from "../components/ErrorComponent";
const StatusesPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { statuses, loading, error } = useSelector(
    (state: AppState) => state.statuses
  );

  const typedStatuses: Status[] = statuses;

  const [showModal, setShowModal] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchStatusesAction());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    setStatusToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (statusToDelete !== null) {
      try {
        await dispatch(deleteStatusAction(statusToDelete));
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

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
            {typedStatuses.map(({ id, description }) => (
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
