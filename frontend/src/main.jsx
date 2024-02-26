import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/App";
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#cda057',
		},
		secondary: {
			main: '#ffffff',
		},
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				// disable MUI ripple effect on all buttons
				disableRipple: true,
			},
		},
	},
});

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	</React.StrictMode>
);
