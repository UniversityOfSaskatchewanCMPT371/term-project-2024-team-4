// Centralized Axios Configuration
// You can change your IP here if needed.
// Note: 127.0.0.1 refers to `localhost`
import axios from "axios";

const http = axios.create({
	baseURL: "http://127.0.0.1:3000",
	withCredentials: true,
});

export default http;
