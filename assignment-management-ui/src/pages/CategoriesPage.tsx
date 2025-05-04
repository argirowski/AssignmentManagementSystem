import { Button, Table, Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Category } from "../types/types";
import { fetchCategories } from "../utils/api/categoryApi";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { deleteCategory } from "../utils/api/categoryApi";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const handleDelete = (id: number) => {
    setCategoryToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete !== null) {
      try {
        await deleteCategory(categoryToDelete);
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryToDelete)
        );
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        setShowModal(false);
        setCategoryToDelete(null);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCategoryToDelete(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
                  <Button
                    variant="danger me-2"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-4 text-start">
          <p>
            Want to add a new category?
            <Link to="/categories/new">Click here</Link>
          </p>
        </div>
      </div>
      <ConfirmDeleteModal
        show={showModal}
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />
    </Container>
  );
};

export default CategoriesPage;
