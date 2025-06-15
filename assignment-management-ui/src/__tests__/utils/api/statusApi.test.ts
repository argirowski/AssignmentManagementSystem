import axios from "axios";
import {
  apiFetchStatuses,
  apiFetchStatusById,
  apiUpdateStatus,
  apiAddStatus,
  apiDeleteStatus,
} from "../../../utils/api/statusApi";
import { Status } from "../../../types/types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("statusApi", () => {
  let consoleSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
  });

  it("fetches statuses", async () => {
    const data = [{ id: "1", description: "Test" }] as Status[];
    mockedAxios.get.mockResolvedValueOnce({ data });
    const result = await apiFetchStatuses();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5088/api/Status"
    );
    expect(result).toEqual(data);
  });

  it("fetches status by id", async () => {
    const data = { id: "1", description: "Test" } as Status;
    mockedAxios.get.mockResolvedValueOnce({ data });
    const result = await apiFetchStatusById("1");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5088/api/Status/1"
    );
    expect(result).toEqual(data);
  });

  it("updates status", async () => {
    const status: Status = { id: "1", description: "Test" };
    mockedAxios.put.mockResolvedValueOnce({});
    await apiUpdateStatus("1", status);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:5088/api/Status/1",
      status
    );
  });

  it("adds status", async () => {
    mockedAxios.post.mockResolvedValueOnce({});
    await apiAddStatus("Test");
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:5088/api/Status",
      { description: "Test" }
    );
  });

  it("deletes status", async () => {
    mockedAxios.delete.mockResolvedValueOnce({});
    await apiDeleteStatus("1");
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "http://localhost:5088/api/Status/1"
    );
  });

  it("logs and throws on fetch statuses error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    await expect(apiFetchStatuses()).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching statuses:",
      expect.any(Error)
    );
  });

  it("logs and throws on fetch status by id error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    await expect(apiFetchStatusById("1")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching status by ID:",
      expect.any(Error)
    );
  });

  it("logs and throws on update status error", async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error("fail"));
    await expect(apiUpdateStatus("1", {} as Status)).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating status:",
      expect.any(Error)
    );
  });

  it("logs and throws on add status error", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("fail"));
    await expect(apiAddStatus("Test")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error adding status:",
      expect.any(Error)
    );
  });

  it("logs and throws on delete status error", async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error("fail"));
    await expect(apiDeleteStatus("1")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deleting status:",
      expect.any(Error)
    );
  });
});
