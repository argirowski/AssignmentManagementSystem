import React, { useEffect, useState } from "react";
import axios from "axios";

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
  createdAt: string;
  employee: Employee;
  status: Status;
  categories: Category[];
};

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

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
    <div className="assignments">
      <h2>Assignments</h2>
      <ul>
        {assignments.map(
          ({
            id,
            title,
            description,
            isCompleted,
            createdAt,
            employee,
            status,
            categories,
          }) => (
            <li key={id}>
              <h3>{title}</h3>
              <p>{description}</p>
              <p>
                <strong>Completed:</strong> {isCompleted ? "Yes" : "No"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Employee:</strong> {employee.fullName} ({employee.email}
                )
              </p>
              <p>
                <strong>Status:</strong> {status.description}
              </p>
              <p>
                <strong>Categories:</strong>{" "}
                {categories.map((category) => category.name).join(", ")}
              </p>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Assignments;
