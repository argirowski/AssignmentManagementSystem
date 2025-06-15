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
  let consoleSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
  });

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

  it("logs and throws on fetch assignments error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    await expect(apiFetchAssignments()).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching assignments:",
      expect.any(Error)
    );
  });

  it("logs and throws on fetch assignment by id error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    await expect(apiFetchAssignmentById("1")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching assignment details:",
      expect.any(Error)
    );
  });

  it("logs and throws on delete assignment error", async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error("fail"));
    await expect(apiDeleteAssignment("1")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deleting assignment:",
      expect.any(Error)
    );
  });

  it("logs and throws on add assignment error", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("fail"));
    await expect(apiAddAssignment({} as CreateAssignment)).rejects.toThrow(
      "fail"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error adding assignment:",
      expect.any(Error)
    );
  });

  it("logs and throws on update assignment error", async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error("fail"));
    await expect(
      apiUpdateAssignment("1", {} as CreateAssignment)
    ).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating assignment:",
      expect.any(Error)
    );
  });
});
