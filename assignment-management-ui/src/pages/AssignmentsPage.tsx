import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Assignment } from "../types/types";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchAssignments } from "../utils/api/assignmentApi";

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
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
                    <Button variant="danger me-2">Delete</Button>
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
    </Container>
  );
};

export default AssignmentsPage;
