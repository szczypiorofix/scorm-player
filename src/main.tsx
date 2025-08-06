import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import './index.css'

const STRICT_MODE = false;

function getAppByMode(strict: boolean) {
    if (strict) {
        return <StrictMode><App /></StrictMode>;
    }
    return <App />
}

createRoot(document.getElementById('root')!).render(getAppByMode(STRICT_MODE));
