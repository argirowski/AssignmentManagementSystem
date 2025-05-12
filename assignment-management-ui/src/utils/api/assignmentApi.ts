import axios from "axios";
import { Assignment, CreateAssignment } from "../../types/types";

const API_BASE_URL = "http://localhost:5088/api";

export const apiFetchAssignments = async (): Promise<Assignment[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Assignment`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    throw error;
  }
};

export const apiFetchAssignmentById = async (
  id: string
): Promise<Assignment> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Assignment/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assignment details:", error);
    throw error;
  }
};

export const apiDeleteAssignment = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/Assignment/${id}`);
  } catch (error) {
    console.error("Error deleting assignment:", error);
    throw error;
  }
};

export const apiAddAssignment = async (
  assignmentData: CreateAssignment
): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/Assignment`, assignmentData);
  } catch (error) {
    console.error("Error adding assignment:", error);
    throw error;
  }
};
