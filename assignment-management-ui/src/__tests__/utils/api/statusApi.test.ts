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
  afterEach(() => jest.clearAllMocks());

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
});
