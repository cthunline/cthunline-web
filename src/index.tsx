import React from 'react';

import { createRoot } from 'react-dom/client';
import App from './components/App.js';

// biome-ignore lint/style/noNonNullAssertion: it is the way
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
