import React, { useEffect, useState } from "react";
import axios from "axios";

type Employee = {
  id: number;
  fullName: string;
  email: string;
};

const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

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
    <div className="employee-list">
      <h2>Employees</h2>
      <ul>
        {employees.map(({ id, fullName, email }) => (
          <li key={id}>
            <strong>{fullName}</strong> - {email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Employee;
