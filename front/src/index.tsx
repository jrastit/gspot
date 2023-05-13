import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from "./App";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from './theme';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<StrictMode> <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline/>
        <App/>
    </ThemeProvider>,
    </StrictMode>);
}


