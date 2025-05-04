import axios from "axios";
import { Employee, NewEmployee } from "../types/types";

const API_BASE_URL = "http://localhost:5088/api";

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Employee`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/Employee/${id}`);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

export const addEmployee = async (employee: NewEmployee): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/Employee`, employee);
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

export const fetchEmployeeById = async (id: string): Promise<Employee> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Employee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    throw error;
  }
};

export const updateEmployee = async (
  id: string,
  employee: Employee
): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/Employee/${id}`, employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};
