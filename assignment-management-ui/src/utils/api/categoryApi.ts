import axios from "axios";
import { Category } from "../../types/types";

const API_BASE_URL = "http://localhost:5088/api";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Category`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Category/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  category: Category
): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/Category/${id}`, category);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const addCategory = async (name: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/Category`, { name });
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/Category/${id}`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
