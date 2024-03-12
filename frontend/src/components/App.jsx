import { UserContextProvider } from "../context/userContext";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NewPage from "./NewPage";
import Catalogue1 from "./HomeCatalogue";
import Catalogue from "./Catalogue";
import Site from "./Site";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<Home />} />

				<Route path="/catalogue" element={<Catalogue />} />
				<Route path="/site" element={<Site />} />

				{/*JUST TESTING*/}
				<Route path="/datalog" element={<Catalogue1 />} />
				<Route path="/new-page" element={<NewPage />} />

				{/* Add new routes here as you make new pages - use '/your_path' as path and the coresponding filename in element. */}
			</Routes>
		</UserContextProvider>
	);
}

export default App;
