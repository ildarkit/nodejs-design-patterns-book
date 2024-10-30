import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import react from 'react';
import reactDOMServer from 'react-dom/server';
import { html } from 'htm/react';
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { StaticRouter, matchPath } from 'react-router-dom';
import { App } from './frontend/App.js';
import { routes } from './frontend/routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const template = ({ content, serverData }) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>My library</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon" />
    <link href="/public/wing.css" rel="stylesheet">
    <link href="/public/style.css" rel="stylesheet">
  </head>
  <body>
    <div id="root">${content}</div>
    ${serverData ? `<script type="text/javascript">
    window.__STATIC_CONTENT__=${JSON.stringify(serverData)}
    </script>` : ''}
    <script type="text/javascript" src="/public/main.js"></script>
  </body>
</html>`;

const server = fastify({ logger: true });

server.register(fastifyStatic, {
  root: resolve(__dirname, '..', 'public'),
  prefix: '/public/'
});

server.get('*', async (req, reply) => {
  const location = req.originalUrl;
  let route;
  let match;
  for (const r of routes) {
    route = r;
    match = matchPath(location, route);
    if (match) break;
  }
  let staticData;
  let staticError;
  let hasStaticContext = false;
  if (typeof route.loadData === 'function') {
    hasStaticContext = true;
    try {
      staticData = await route.loadData(match);
    } catch (err) {
      staticError = err;
    }
  }
  const staticContext = {
    [location]: {
      data: staticData,
      err: staticError,
    },
  };
  const serverApp = html`
    <${StaticRouter}
      location=${location}
      context=${staticContext}
    >
      <${App}/>
    </>
  `;
  const content = reactDOMServer.renderToString(serverApp);
  const serverData = hasStaticContext ? staticContext : null;
  const responseHtml = template({ content, serverData });

  let code = 200;
  if (staticContext.statusCode)
    code = staticContext.statusCode;

  reply.code(code).type('text/html').send(responseHtml);
});

const port = Number.parseInt(process.env.PORT) || 3000;
const host = process.env.ADDRESS || '127.0.0.1';

server.listen({ port, host }, function(err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});