import React from "react";

type EmployeeDetailsProps = {
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
};

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  name,
  position,
  department,
  email,
  phone,
}) => {
  return (
    <div className="employee-details">
      <h2>{name}</h2>
      <p>Position: {position}</p>
      <p>Department: {department}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
    </div>
  );
};

export default EmployeeDetails;
