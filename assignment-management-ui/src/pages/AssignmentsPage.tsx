import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignmentsAction,
  deleteAssignmentAction,
} from "../redux/assignment/assignmentActions";
import { AppState, AppDispatch } from "../store";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import WithLoadingAndError from "../components/WithLoadingAndError";
import { closeModal } from "../utils/modalHelpers";

const AssignmentsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { assignments, loading, error } = useSelector(
    (state: AppState) => state.assignments
  );
  const [showModal, setShowModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchAssignmentsAction());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    setAssignmentToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (assignmentToDelete !== null) {
      dispatch(deleteAssignmentAction(assignmentToDelete));
      setShowModal(false);
      setAssignmentToDelete(null);
    }
  };

  return (
    <WithLoadingAndError loading={loading} error={error}>
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
          onCancel={() => closeModal(setShowModal, setAssignmentToDelete)}
        />
      </Container>
    </WithLoadingAndError>
  );
};

export default AssignmentsPage;
