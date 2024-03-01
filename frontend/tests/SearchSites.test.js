/* eslint-disable no-undef */
import { render, fireEvent, waitFor } from "@testing-library/react";
import SearchResult from "./components/SearchResult";

describe("SearchResult component", () => {
	test("renders SearchResult component with correct initial state", () => {
		const { getByText } = render(<SearchResult query="query" />);

		expect(getByText("Loading...")).toBeInTheDocument();
	});

	test("displays search results correctly when data is fetched successfully", async () => {
		const mockData = [
			{ id: 1, name: "Name 1", location: "Location 1" },
			{ id: 2, name: "Name 2", location: "Location 2" },
		];

		jest.spyOn(global, "fetch").mockResolvedValueOnce({
			json: jest.fn().mockResolvedValueOnce(mockData),
		});

		const { findByText } = render(<SearchResult query="query" />);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		expect(await findByText("Name 1")).toBeInTheDocument();
		expect(await findByText("Location 1")).toBeInTheDocument();
		expect(await findByText("Name 2")).toBeInTheDocument();
		expect(await findByText("Location 2")).toBeInTheDocument();
	});

	test("calls handleClick2 function with correct ID when a card is clicked", async () => {
		const mockData = [
			{ id: 1, name: "Name 1", location: "Location 1" },
			{ id: 2, name: "Name 2", location: "Location 2" },
		];

		jest.spyOn(global, "fetch").mockResolvedValueOnce({
			json: jest.fn().mockResolvedValueOnce(mockData),
		});

		const { findAllByRole } = render(<SearchResult query="query" />);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		const cards = await findAllByRole("button");

		fireEvent.click(cards[0]);

		expect(global.console.log).toHaveBeenCalledWith("Card clicked! ID:", 1);
	});
});
