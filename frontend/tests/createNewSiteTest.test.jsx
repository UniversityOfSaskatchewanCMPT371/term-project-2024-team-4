import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import CreateNewSite from "../src/components/CreateNewSite.jsx";

// Mocking axios for all tests
vi.mock("axios");

describe("CreateNewSite Integration Tests", () => {
  let openMock;

  beforeEach(() => {
    // Resetting mocks before each test
    vi.resetAllMocks();
    openMock = vi.fn();
    render(<CreateNewSite setOpen={openMock} />);
  });

  it("should create a new site on form submission", async () => {
    // Mocking the API call
    axios.post.mockResolvedValue({ data: { name: "New Site" } });

    // Mocking the API call for fetching regions
    const mockRegions = [
      { id: 1, name: "Region1" },
      { id: 2, name: "Region2" },
    ];
    axios.get.mockResolvedValueOnce({ data: mockRegions });

    // Filling out the form and submit
    fireEvent.change(screen.getByLabelText("Site Name"), {
      target: { value: "New Site" },
    });
    fireEvent.change(screen.getByLabelText("Site Description"), {
      target: { value: "A new site description" },
    });
    fireEvent.change(screen.getByLabelText("Location"), {
      target: { value: "New Location" },
    });

    render(<CreateNewSite setOpen={openMock} />);

    // Check if Region2 is in the list of regions
    await waitFor(() => {
      expect(screen.getByText("Region2")).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByLabelText("Region"));
    fireEvent.click(screen.getByText("Region2"));

    fireEvent.click(screen.getByText("Add"));

    // Wait for API call and assertions
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: "New Site" })
      );
      expect(openMock).toHaveBeenCalledWith(false); // Dialog should close
    });
  });

  it("should not create a new site on form submission with missing Location and Region", async () => {
    // Seting up the mock response for an unsuccessful submission due to validation failure
    axios.post.mockRejectedValue(new Error("Location and Region are required"));

    // Filling out the form, omitting the 'Location' and 'Region'
    fireEvent.change(screen.getByLabelText("Site Name"), {
      target: { value: "Incomplete Site" },
    });
    fireEvent.change(screen.getByLabelText("Site Description"), {
      target: { value: "An incomplete site description" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Add"));

    // Wait for the expected failure
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled(); // Ensures the POST request was not made due to validation failure
      expect(screen.queryByText("Location is required")).toBeInTheDocument();
      expect(screen.queryByText("Region is required")).toBeInTheDocument();

      expect(openMock).not.toHaveBeenCalledWith(); // Ensures the dialog remains open due to the error
    });
  });

  it("should allow an existing region to be edited", async () => {
    // Mocking initial regions fetch
    const regions = [
      { id: 1, name: "Region1", description: "Description1" },
      { id: 2, name: "Region2", description: "Description2" },
    ];
    axios.get.mockResolvedValue({ data: regions });

    // Mocking the API call for updating a region
    const updatedRegion = {
      id: 1,
      name: "Region1 Updated",
      description: "Description1 Updated",
    };
    axios.put.mockResolvedValue({ data: updatedRegion });

    // Trigger the fetch regions
    fireEvent.click(screen.getByLabelText("Region"));
    await waitFor(() => {
      expect(screen.getByText("Region1")).toBeInTheDocument();
    });

    // Simulating opening the edit menu for the first region
    fireEvent.click(screen.getAllByLabelText("+ Add More")[0]);
    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Edit"));

    // Assume EditRegion component is rendered and perform mock edit
    fireEvent.change(screen.getByLabelText("Region Name"), {
      target: { value: "Region1 Updated" },
    });
    fireEvent.change(screen.getByLabelText("Region Description"), {
      target: { value: "Description1 Updated" },
    });

    // Click save button for the editing form
    fireEvent.click(screen.getByText("Save"));

    // Assertions to verify if the region was updated
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:3000/regions/1", // Assuming this URL and ID
        expect.objectContaining({
          name: "Region1 Updated",
          description: "Description1 Updated",
        })
      );
      // Verify if UI is updated or other actions are performed post update
      expect(screen.queryByText("Region1 Updated")).toBeInTheDocument();
    });
  });

  it("should handle region deletion correctly", async () => {
    // Mocking initial regions fetch and deletion API call
    const regions = [{ id: 1, name: "Region1", description: "Description1" }];
    axios.get.mockResolvedValue({ data: regions });
    axios.delete.mockResolvedValue({}); // Assume deletion is successful

    // Trigger regions fetch and open the delete menu
    fireEvent.click(screen.getByLabelText("Region"));
    await waitFor(() => {
      fireEvent.click(screen.getByText("Region1"));
      fireEvent.click(screen.getByText("Delete"));
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:3000/regions/1"
      );
    });
  });
});
