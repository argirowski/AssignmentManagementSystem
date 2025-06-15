import axios from "axios";
import {
  apiFetchCategories,
  apiFetchCategoryById,
  apiUpdateCategory,
  apiAddCategory,
  apiDeleteCategory,
} from "../../../utils/api/categoryApi";
import { Category } from "../../../types/types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("categoryApi", () => {
  afterEach(() => jest.clearAllMocks());

  it("fetches categories", async () => {
    const data = [{ id: "1", name: "Test" }] as Category[];
    mockedAxios.get.mockResolvedValueOnce({ data });
    const result = await apiFetchCategories();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5088/api/Category"
    );
    expect(result).toEqual(data);
  });

  it("fetches category by id", async () => {
    const data = { id: "1", name: "Test" } as Category;
    mockedAxios.get.mockResolvedValueOnce({ data });
    const result = await apiFetchCategoryById("1");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5088/api/Category/1"
    );
    expect(result).toEqual(data);
  });

  it("updates category", async () => {
    const category: Category = { id: "1", name: "Test" };
    mockedAxios.put.mockResolvedValueOnce({});
    await apiUpdateCategory("1", category);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:5088/api/Category/1",
      category
    );
  });

  it("adds category", async () => {
    mockedAxios.post.mockResolvedValueOnce({});
    await apiAddCategory("Test");
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:5088/api/Category",
      { name: "Test" }
    );
  });

  it("deletes category", async () => {
    mockedAxios.delete.mockResolvedValueOnce({});
    await apiDeleteCategory("1");
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "http://localhost:5088/api/Category/1"
    );
  });
});
