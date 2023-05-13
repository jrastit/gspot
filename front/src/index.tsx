import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from "./App";
import {MetaMaskProvider} from 'metamask-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <MetaMaskProvider>
                <App/>
            </MetaMaskProvider>
        </StrictMode>
    );
}


