import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';

export function render(url) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );

  // Basic SEO meta tags
  const head = `
    <title>S4 Holidays - Best Travel Packages</title>
    <meta name="description" content="Explore domestic, international, pilgrimage and group trip packages with S4 Holidays" />
    <meta name="keywords" content="travel packages, holidays, tourism, S4 Holidays" />
  `;

  return { html, head };
}
