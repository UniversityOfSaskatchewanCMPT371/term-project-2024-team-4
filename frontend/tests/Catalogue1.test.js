/* eslint-disable no-undef */
import { render, fireEvent } from "@testing-library/react";
import Catalogue1 from "./components/Catalogue1";

describe("Catalogue1 component", () => {
	test("renders Catalogue1 component with correct initial values", () => {
		const { getByLabelText, getByText } = render(
			<Catalogue1 props="catalogue" />,
		);

		const searchInput = getByLabelText("Search");
		const sortSelect = getByLabelText("Sort");
		const filterSelect = getByLabelText("Filter");
		const searchButton = getByLabelText("search");

		expect(searchInput).toBeInTheDocument();
		expect(sortSelect).toBeInTheDocument();
		expect(filterSelect).toBeInTheDocument();
		expect(searchButton).toBeInTheDocument();
		expect(getByText("Catalogue")).toBeInTheDocument();
	});

	test("updates searchValue state when search input changes", () => {
		const { getByLabelText } = render(<Catalogue1 props="catalogue" />);
		const searchInput = getByLabelText("Search");

		fireEvent.change(searchInput, { target: { value: "New Search Value" } });

		expect(searchInput.value).toBe("New Search Value");
	});

	test("calls handleSortChange function when sort select changes", () => {
		const handleSortChangeMock = jest.fn();
		const { getByLabelText } = render(<Catalogue1 props="catalogue" />);
		const sortSelect = getByLabelText("Sort");

		fireEvent.change(sortSelect, { target: { value: "descendant" } });

		expect(handleSortChangeMock).toHaveBeenCalled(); // Check that handleSortChange function is called
		expect(sortSelect.value).toBe("descendant");
	});

	test("calls handleFilterChange function when filter select changes", () => {
		const handleFilterChangeMock = jest.fn();
		const { getByLabelText } = render(<Catalogue1 props="catalogue" />);
		const filterSelect = getByLabelText("Filter");

		fireEvent.change(filterSelect, { target: { value: "category1" } });

		expect(handleFilterChangeMock).toHaveBeenCalled(); // Check that handleFilterChange function is called
		expect(filterSelect.value).toBe("category1");
	});
});
