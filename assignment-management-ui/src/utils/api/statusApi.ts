import axios from "axios";
import { Status } from "../../types/types";

const API_BASE_URL = "http://localhost:5088/api";

export const apiFetchStatuses = async (): Promise<Status[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching statuses:", error);
    throw error;
  }
};

export const apiDeleteStatus = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/Status/${id}`);
  } catch (error) {
    console.error("Error deleting status:", error);
    throw error;
  }
};

export const apiAddStatus = async (description: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/Status`, { description });
  } catch (error) {
    console.error("Error adding status:", error);
    throw error;
  }
};

export const apiFetchStatusById = async (id: string): Promise<Status> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Status/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching status by ID:", error);
    throw error;
  }
};

export const apiUpdateStatus = async (
  id: string,
  status: Status
): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/Status/${id}`, status);
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};
