import express from 'express';
import httpProxy from 'http-proxy';
import consul from 'consul';

const routing = [
  {
    letterPathRegexp: /[a-dA-D]/,
    service: 'a-d-api-service',
    index: 0
  },
  {
    letterPathRegexp: /[e-pE-P]/,
    service: 'e-p-api-service',
    index: 0
  },
  {
    letterPathRegexp: /[q-zQ-Z]/,
    service: 'q-z-api-service',
    index: 0
  }
]

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const consulClient = consul();
const proxy = httpProxy.createProxyServer();

app.get('/api/*/:letter', (req, res) => {
  const route = routing.find(
    route => route.letterPathRegexp.test(req.params.letter)
  );
  consulClient.agent.service.list((err, services) => {
    const servers = !err && Object.values(services)
      .filter(service => service.Tags.includes(route.service));

    if (err || !servers.length) {
      res.writeHead(502);
      return res.end('Bad gateway');
    }

    route.index = (route.index + 1) % servers.length;
    const server = servers[route.index];
    const target = `http://${server.Address}:${server.Port}`;
    proxy.web(req, res, { target });
  });
});

app.listen(8080, () => console.log('Load balancer started on port 8080'));
