import React, { useEffect, useState } from "react";
import { fetchEmployees, deleteEmployee } from "../utils/api/employeeApi";
import { Button, Table, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Employee } from "../types/types";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    getEmployees();
  }, []);

  const handleDelete = (id: number) => {
    setEmployeeToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete !== null) {
      try {
        await deleteEmployee(employeeToDelete);
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== employeeToDelete)
        );
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
  );
};

export default EmployeesPage;
