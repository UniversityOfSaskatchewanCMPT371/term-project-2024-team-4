// // UserContextProvider.js
// import { createContext, useState, useEffect, useCallback } from "react";
// import axios from "axios";

// export const UserContext = createContext({});

// export function UserContextProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loaded, setLoaded] = useState(false);

//   const fetchData = useCallback(async () => {
//     if (!loaded) {
//       axios.get("/users").then(({ data }) => {
//         setUser(data);
//         setLoaded(true);
//       });
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, []);
//   return (
//     <UserContext.Provider
//       value={{ user, setUser, fetchData, loaded, setLoaded }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }
