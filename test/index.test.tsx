import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useGoogleSheets from "../src";

vi.mock("google-sheets-mapper", () => ({
  default: {
    fetchGoogleSheetsData: vi.fn(),
  },
}));

import GoogleSheetsMapper from "google-sheets-mapper";

const mockFetch = vi.mocked(GoogleSheetsMapper.fetchGoogleSheetsData);

describe("useGoogleSheets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns initial loading state", () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() =>
      useGoogleSheets({
        apiKey: "test-api-key",
        sheetId: "test-sheet-id",
      }),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.called).toBe(false);
  });

  it("fetches data successfully", async () => {
    const mockData = [{ id: "Sheet1", data: [{ key: "value" }] }];
    mockFetch.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useGoogleSheets({
        apiKey: "test-api-key",
        sheetId: "test-sheet-id",
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.called).toBe(true);
  });

  it("handles errors", async () => {
    const mockError = { response: { url: "test", status: 404, statusText: "Not Found" } };
    mockFetch.mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useGoogleSheets({
        apiKey: "test-api-key",
        sheetId: "test-sheet-id",
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toEqual([]);
    expect(result.current.called).toBe(true);
  });

  it("passes sheetsOptions to the mapper", async () => {
    mockFetch.mockResolvedValue([]);

    renderHook(() =>
      useGoogleSheets({
        apiKey: "test-api-key",
        sheetId: "test-sheet-id",
        sheetsOptions: [{ id: "Sheet1" }],
      }),
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith({
        apiKey: "test-api-key",
        sheetId: "test-sheet-id",
        sheetsOptions: [{ id: "Sheet1" }],
      });
    });
  });

  it("refetch triggers new fetch after initial call", async () => {
    const mockData = [{ id: "Sheet1", data: [] }];
    mockFetch.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useGoogleSheets({
        apiKey: "test-api-key",
        sheetId: "test-sheet-id",
      }),
    );

    await waitFor(() => {
      expect(result.current.called).toBe(true);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);

    result.current.refetch();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
