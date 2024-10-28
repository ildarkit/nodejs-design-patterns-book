import { createRoot } from 'react-dom/client';
import { html } from 'htm/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.js';

const root = createRoot(document.getElementById('root'));

root.render(
  html`<${BrowserRouter}><${App}/></>`
);
