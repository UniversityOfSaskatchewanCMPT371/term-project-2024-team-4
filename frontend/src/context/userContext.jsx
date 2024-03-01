import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
	const [user, setUser] = useState(null);

	const getData = useCallback(async () => {

		axios.get("http://localhost:3000/users", { withCredentials: true })
			.then(({ data }) => {
				setUser(data);
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	});
	// Fetch user data or set user based on your logic
	useEffect(() =>{
		getData();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, getData }}>
			{children}
		</UserContext.Provider>
	);
}