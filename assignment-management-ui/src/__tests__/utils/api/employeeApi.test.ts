import axios from "axios";
import {
  apiFetchEmployees,
  apiFetchEmployeeById,
  apiUpdateEmployee,
  apiAddEmployee,
  apiDeleteEmployee,
} from "../../../utils/api/employeeApi";
import { Employee, NewEmployee } from "../../../types/types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("employeeApi", () => {
  let consoleSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
  });

  it("fetches employees", async () => {
    const data = [{ id: "1", fullName: "Test" }] as Employee[];
    mockedAxios.get.mockResolvedValueOnce({ data });
    const result = await apiFetchEmployees();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5088/api/Employee"
    );
    expect(result).toEqual(data);
  });

  it("fetches employee by id", async () => {
    const data = { id: "1", fullName: "Test" } as Employee;
    mockedAxios.get.mockResolvedValueOnce({ data });
    const result = await apiFetchEmployeeById("1");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5088/api/Employee/1"
    );
    expect(result).toEqual(data);
  });

  it("updates employee", async () => {
    const employee: Employee = { id: "1", fullName: "Test" } as Employee;
    mockedAxios.put.mockResolvedValueOnce({});
    await apiUpdateEmployee("1", employee);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:5088/api/Employee/1",
      employee
    );
  });

  it("adds employee", async () => {
    const newEmployee: NewEmployee = { fullName: "Test" } as NewEmployee;
    mockedAxios.post.mockResolvedValueOnce({});
    await apiAddEmployee(newEmployee);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:5088/api/Employee",
      newEmployee
    );
  });

  it("deletes employee", async () => {
    mockedAxios.delete.mockResolvedValueOnce({});
    await apiDeleteEmployee("1");
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "http://localhost:5088/api/Employee/1"
    );
  });

  it("logs and throws on fetch employees error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    await expect(apiFetchEmployees()).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching employees:",
      expect.any(Error)
    );
  });

  it("logs and throws on fetch employee by id error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    await expect(apiFetchEmployeeById("1")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching employee by ID:",
      expect.any(Error)
    );
  });

  it("logs and throws on update employee error", async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error("fail"));
    await expect(apiUpdateEmployee("1", {} as Employee)).rejects.toThrow(
      "fail"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating employee:",
      expect.any(Error)
    );
  });

  it("logs and throws on add employee error", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("fail"));
    await expect(apiAddEmployee({} as NewEmployee)).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error adding employee:",
      expect.any(Error)
    );
  });

  it("logs and throws on delete employee error", async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error("fail"));
    await expect(apiDeleteEmployee("1")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deleting employee:",
      expect.any(Error)
    );
  });
});
