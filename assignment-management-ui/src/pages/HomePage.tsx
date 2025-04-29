import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const HomePage: React.FC = () => {
  return (
    <Container className="text-center mt-5">
      <h1>Welcome to my Assignment app</h1>
      <p className="mt-4">
        <Link to="/assignments" className="btn btn-primary btn-lg">
          View Assignments
        </Link>
      </p>
    </Container>
  );
};

export default HomePage;
