import {
  apiFetchAssignments,
  apiFetchAssignmentById,
  apiDeleteAssignment,
  apiAddAssignment,
  apiUpdateAssignment,
} from "../../../utils/api/assignmentApi";
import { Assignment, CreateAssignment } from "../../../types/types";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("assignmentApi", () => {
  afterEach(() => jest.clearAllMocks());

  it("fetches assignments", async () => {
    const data = [{ id: "1", title: "Test" }] as Assignment[];
    mockedAxios.get.mockResolvedValueOnce({ data });
    const result = await apiFetchAssignments();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5088/api/Assignment"
    );
    expect(result).toEqual(data);
  });

  it("fetches assignment by id", async () => {
    const data = { id: "1", title: "Test" } as Assignment;
    mockedAxios.get.mockResolvedValueOnce({ data });
    const result = await apiFetchAssignmentById("1");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5088/api/Assignment/1"
    );
    expect(result).toEqual(data);
  });

  it("deletes assignment", async () => {
    mockedAxios.delete.mockResolvedValueOnce({});
    await apiDeleteAssignment("1");
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "http://localhost:5088/api/Assignment/1"
    );
  });

  it("adds assignment", async () => {
    const assignment: CreateAssignment = {
      title: "A",
      description: "B",
      isCompleted: false,
      employeeId: "1",
      statusId: "2",
      categoryIds: ["3"],
    };
    mockedAxios.post.mockResolvedValueOnce({});
    await apiAddAssignment(assignment);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:5088/api/Assignment",
      assignment
    );
  });

  it("updates assignment", async () => {
    const assignment: CreateAssignment = {
      title: "A",
      description: "B",
      isCompleted: false,
      employeeId: "1",
      statusId: "2",
      categoryIds: ["3"],
    };
    mockedAxios.put.mockResolvedValueOnce({});
    await apiUpdateAssignment("1", assignment);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:5088/api/Assignment/1",
      assignment
    );
  });
});
