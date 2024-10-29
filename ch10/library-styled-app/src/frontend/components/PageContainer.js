import { html } from 'htm/react';
import { Header } from './Header.js';
import { Footer } from './Footer.js';

export function PageContainer({ children }) {
  return html`
    <div className="container">
      <${Header}/>
        ${children}
      <${Footer}/>
    </div>`;
} 
