import { UserContextProvider } from "../context/userContext";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import axios from "axios";
import StatisticsPage from "./StatisticsPage";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/stats" element={<StatisticsPage />} />
				{/* Add new routes here as you make new pages - use '/your_path' as path and the coresponding filename in element. */}
			</Routes>
		</UserContextProvider>
	);
}

export default App;
