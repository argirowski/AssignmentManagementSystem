import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Assignment } from "../types/types";



const AssignmentsPage: React.FC = () => {
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

export default AssignmentsPage;
