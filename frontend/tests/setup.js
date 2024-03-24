import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom";
import axios from "axios";
axios.defaults.adapter = "http";

expect.extend(matchers);

afterEach(() => {
	cleanup();
});
