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
  afterEach(() => jest.clearAllMocks());

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
});
