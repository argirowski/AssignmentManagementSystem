import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Assignment } from "../types/types";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchAssignments, deleteAssignment } from "../utils/api/assignmentApi";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAssignments = async () => {
      try {
        const data = await fetchAssignments();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    getAssignments();
  }, []);

  const handleDelete = (id: string) => {
    setAssignmentToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (assignmentToDelete !== null) {
      setDeleting(true);
      try {
        await deleteAssignment(assignmentToDelete);
        const updatedAssignments = await fetchAssignments();
        setAssignments(updatedAssignments);
      } catch (error) {
        console.error("Error deleting assignment:", error);
      } finally {
        setDeleting(false);
        setShowModal(false);
        setAssignmentToDelete(null);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setAssignmentToDelete(null);
  };

  if (loading || deleting) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <div className="assignments">
        <h2>Assignments</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Completed</th>
              <th>Employee</th>
              <th>Status</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(
              ({
                id,
                title,
                description,
                isCompleted,
                employee,
                status,
                categories,
              }) => (
                <tr key={id}>
                  <td>{title}</td>
                  <td>{description}</td>
                  <td>{isCompleted ? "Yes" : "No"}</td>

                  <td>{employee.fullName}</td>
                  <td>{status.description}</td>
                  <td>
                    {categories.map((category) => category.name).join(", ")}
                  </td>
                  <td>
                    <Button
                      variant="success me-2"
                      onClick={() => navigate(`/assignments/${id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="warning me-2"
                      onClick={() => navigate(`/assignments/${id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger me-2"
                      onClick={() => handleDelete(id.toString())}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
        <div className="mt-4 text-start">
          <p>
            Want to add a new assignment?
            <Link to="/assignments/new">Click here</Link>
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

export default AssignmentsPage;
