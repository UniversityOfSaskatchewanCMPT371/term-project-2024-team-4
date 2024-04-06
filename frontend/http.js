// Centralized Axios Configuration
// You can change your IP here if needed.
// Note: 127.0.0.1 refers to `localhost`
import axios from "axios";

// To be able to import var
export const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

const http = axios.create({
	baseURL: baseURL,
	withCredentials: true,
});

export default http;
