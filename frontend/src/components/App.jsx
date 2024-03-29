import { UserContextProvider } from "../context/userContext";
import { Route, Routes } from "react-router-dom";
import Catalogue from "./Catalogue";
import Site from "./Site";
import StatisticsPage from "./StatisticsPage";
import SettingsPage  from "./SettingsPage";

/**
 * Main App component which contains the routing paths
 * @pre None
 * @post Renders main parent App component
 * @returns {JSX.Element} App React component
 */
function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<Catalogue />} />
				<Route path="/site" element={<Site />} />
				<Route path="/stats" element={<StatisticsPage />} />
				<Route path="/settings" element={<SettingsPage />} />
				{/* Add new routes here as you make new pages - use '/your_path' as path and the coresponding filename in element. */}
			</Routes>
		</UserContextProvider>
	);
}

export default App;