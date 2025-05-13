import { Button, Table, Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Category } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesAction,
  deleteCategoryAction,
} from "../redux/category/categoryActions";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { AppState, AppDispatch } from "../store";
import ErrorComponent from "../components/ErrorComponent";

const CategoriesPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector(
    (state: AppState) => state.categories
  );

  const typedCategories: Category[] = categories;

  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete !== null) {
      try {
        await dispatch(deleteCategoryAction(categoryToDelete));
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

  if (error) {
    return <ErrorComponent message={error} />;
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
            {typedCategories.map(({ id, name }) => (
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
