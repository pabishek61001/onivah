import { createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
    palette: {
        primary: {
            // main: '#4169E1', // Primary color
            main: "#8e5fbc"
        },
        secondary: {
            main: '#2899f5', // Secondary color
        },
    },
    typography: {
        fontFamily: '"Kanit", sans-serif', // Set font family for all text
    },
    components: {
        // Customize MUI components
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    // Apply custom styles for MenuItem
                    fontFamily: '"Kanit", sans-serif',
                    fontWeight: "300"
                    // Add other styles if needed
                },
            },
        },
        // You can add other components here if needed
    },
});

export default theme;
