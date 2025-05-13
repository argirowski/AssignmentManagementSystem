import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../store";
import {
  fetchEmployeesAction,
  deleteEmployeeAction,
} from "../redux/employee/employeeActions";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import WithLoadingAndError from "../components/WithLoadingAndError";

const EmployeesPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { employees, loading, error } = useSelector(
    (state: AppState) => state.employees
  );
  const [showModal, setShowModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEmployeesAction());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    setEmployeeToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete !== null) {
      try {
        await dispatch(deleteEmployeeAction(employeeToDelete));
      } catch (error) {
        console.error("Error deleting employee:", error);
      } finally {
        setShowModal(false);
        setEmployeeToDelete(null);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEmployeeToDelete(null);
  };

  return (
    <WithLoadingAndError loading={loading} error={error}>
      <Container>
        <div className="employee-list">
          <h2>Employees</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(({ id, fullName, email }) => (
                <tr key={id}>
                  <td>{fullName}</td>
                  <td>{email}</td>
                  <td>
                    <Button
                      variant="success me-2"
                      onClick={() => navigate(`/employees/${id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="warning me-2"
                      onClick={() => navigate(`/employees/${id}/edit`)}
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
              Want to add a new employee?{" "}
              <Link to="/employees/new">Click here</Link>
            </p>
          </div>
        </div>
        <ConfirmDeleteModal
          show={showModal}
          onConfirm={confirmDelete}
          onCancel={closeModal}
        />
      </Container>
    </WithLoadingAndError>
  );
};

export default EmployeesPage;
