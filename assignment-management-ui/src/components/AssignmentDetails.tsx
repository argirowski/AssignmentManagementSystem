import React from "react";

type AssignmentDetailsProps = {
  title: string;
  dueDate: string;
  description: string;
  assignedTo: string;
  status: string;
};

const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({
  title,
  dueDate,
  description,
  assignedTo,
  status,
}) => {
  return (
    <div className="assignment-details">
      <h2>{title}</h2>
      <p>Due Date: {dueDate}</p>
      <p>{description}</p>
      <p>Assigned To: {assignedTo}</p>
      <p>Status: {status}</p>
    </div>
  );
};

export default AssignmentDetails;
