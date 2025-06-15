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
  let consoleSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
  });

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

  it("logs and throws on fetch categories error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    await expect(apiFetchCategories()).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching categories:",
      expect.any(Error)
    );
  });

  it("logs and throws on fetch category by id error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    await expect(apiFetchCategoryById("1")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching category by ID:",
      expect.any(Error)
    );
  });

  it("logs and throws on update category error", async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error("fail"));
    await expect(apiUpdateCategory("1", {} as Category)).rejects.toThrow(
      "fail"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating category:",
      expect.any(Error)
    );
  });

  it("logs and throws on add category error", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("fail"));
    await expect(apiAddCategory("Test")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error adding category:",
      expect.any(Error)
    );
  });

  it("logs and throws on delete category error", async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error("fail"));
    await expect(apiDeleteCategory("1")).rejects.toThrow("fail");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deleting category:",
      expect.any(Error)
    );
  });
});
