import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { getItems, addItem, deleteItem } from "../../services/apiService";

// Mock the API service
jest.mock("../../services/apiService");

describe("App Component", () => {
  const mockGetItems = getItems as jest.MockedFunction<typeof getItems>;
  const mockAddItem = addItem as jest.MockedFunction<typeof addItem>;
  const mockDeleteItem = deleteItem as jest.MockedFunction<typeof deleteItem>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup default mock responses
    mockGetItems.mockResolvedValue({
      items: ["item1", "item2"],
      success: true,
    });
    mockAddItem.mockResolvedValue({
      success: true,
      items: ["item1", "item2", "new item"],
    });
    mockDeleteItem.mockResolvedValue({
      success: true,
      items: ["item2"],
    });
  });

  it("renders the app with items", async () => {
    render(<App />);

    // Check if the title is rendered
    expect(screen.getByText("Items")).toBeInTheDocument();

    // Wait for items to be loaded
    await waitFor(() => {
      expect(screen.getByText("item1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("item2")).toBeInTheDocument();
    });

    // Check if the input and add button are rendered
    expect(screen.getByPlaceholderText("Add new item")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("adds a new item when the form is submitted", async () => {
    render(<App />);

    // Wait for initial items to load
    await waitFor(() => {
      expect(screen.getByText("item1")).toBeInTheDocument();
    });

    // Get the input and add button
    const input = screen.getByPlaceholderText("Add new item");
    const addButton = screen.getByText("Add");

    // Type in the input and click add
    fireEvent.change(input, { target: { value: "new item" } });
    fireEvent.click(addButton);

    // Check if addItem was called with the correct value
    expect(mockAddItem).toHaveBeenCalledWith({ name: "new item" });

    // Mock the getItems response after adding
    mockGetItems.mockResolvedValueOnce({
      items: ["item1", "item2", "new item"],
      success: true,
    });

    // Check if the new item appears in the list
    await waitFor(() => {
      expect(screen.getByText("new item")).toBeInTheDocument();
    });
  });

  it("deletes an item when delete button is clicked", async () => {
    render(<App />);

    // Wait for items to be loaded
    await waitFor(() => {
      expect(screen.getByText("item1")).toBeInTheDocument();
    });

    // Find and click the delete button for item1
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    // Check if deleteItem was called with the correct value
    expect(mockDeleteItem).toHaveBeenCalledWith("item1");

    // Mock the getItems response after deletion
    mockGetItems.mockResolvedValueOnce({
      items: ["item2"],
      success: true,
    });

    // Check if the item was removed from the list
    await waitFor(() => {
      expect(screen.queryByText("item1")).not.toBeInTheDocument();
    });
  });

  it("trims input before adding item", async () => {
    render(<App />);

    // Wait for initial items to load
    await waitFor(() => {
      expect(screen.getByText("item1")).toBeInTheDocument();
    });

    // Get the input and add button
    const input = screen.getByPlaceholderText("Add new item");
    const addButton = screen.getByText("Add");

    // Type in the input with extra spaces
    fireEvent.change(input, { target: { value: "  new item  " } });
    fireEvent.click(addButton);

    // Check if addItem was called with trimmed value
    expect(mockAddItem).toHaveBeenCalledWith({ name: "new item" });

    // Mock the getItems response after adding
    mockGetItems.mockResolvedValueOnce({
      items: ["item1", "item2", "new item"],
      success: true,
    });

    // Check if the trimmed item appears in the list
    await waitFor(() => {
      expect(screen.getByText("new item")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    // Mock API error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetItems.mockRejectedValue(new Error("API Error"));

    render(<App />);

    // Check if error was logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
