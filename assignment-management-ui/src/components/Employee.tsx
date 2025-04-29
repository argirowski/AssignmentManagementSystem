import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Employee = {
  id: number;
  fullName: string;
  email: string;
};

const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5088/api/Employee");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

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

export default Employee;
