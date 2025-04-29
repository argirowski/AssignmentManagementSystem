import { Button, Table, Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Category } from "../types/types";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5088/api/Category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Container>
      <div className="categories">
        <h2>Categories</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(({ id, name }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>
                  <Button
                    variant="success me-2"
                    onClick={() => navigate(`/categories/${id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="warning me-2"
                    onClick={() => navigate(`/categories/${id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button variant="danger me-2">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-4 text-start">
          <p>
            Want to add a new category?{" "}
            <Link to="/categories/new">Click here</Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default CategoriesPage;
