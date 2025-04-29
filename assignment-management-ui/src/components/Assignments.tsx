import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Employee = {
  id: number;
  fullName: string;
  email: string;
};

type Status = {
  id: number;
  description: string;
};

type Category = {
  id: number;
  name: string;
};

type Assignment = {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  employee: Employee;
  status: Status;
  categories: Category[];
};

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5088/api/Assignment"
        );
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

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

                  <td>
                    {employee.fullName} ({employee.email})
                  </td>
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
                    <Button variant="warning me-2">Edit</Button>
                    <Button variant="danger me-2">Delete</Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Assignments;
