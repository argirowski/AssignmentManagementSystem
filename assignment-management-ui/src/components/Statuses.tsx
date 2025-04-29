import React, { useEffect, useState } from "react";
import axios from "axios";

type Status = {
  id: number;
  description: string;
};

const Statuses: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get("http://localhost:5088/api/Status");
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, []);

  return (
    <div className="statuses">
      <h2>Statuses</h2>
      <ul>
        {statuses.map(({ id, description }) => (
          <li key={id}>{description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Statuses;
