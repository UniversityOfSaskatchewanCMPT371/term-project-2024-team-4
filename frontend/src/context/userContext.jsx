import { createContext, useState, useEffect, useCallback } from "react";
import http from "../../http";

export const UserContext = createContext({});

// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {
	const [user, setUser] = useState(null);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const getData = useCallback(async () => {
		http
			.get("/users", { withCredentials: true })
			.then(({ data }) => {
				setUser(data);
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	});
	// Fetch user data or set user based on your logic
	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, getData }}>
			{children}
		</UserContext.Provider>
	);
}
