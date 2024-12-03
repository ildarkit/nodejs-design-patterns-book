import express from 'express';
import httpProxy from 'http-proxy';
import Consul from 'consul';

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

const consulClient = new Consul();
const proxy = httpProxy.createProxyServer();

app.get('/api/*/:letter', async (req, res) => {
  const route = routing.find(
    route => route.letterPathRegexp.test(req.params.letter)
  );
  const servers = Object.values(await consulClient.agent.service.list())
    .filter(service => service.Tags.includes(route.service));

  if (!servers.length) {
    res.writeHead(502);
    return res.end('Bad gateway');
  }

  route.index = (route.index + 1) % servers.length;
  const server = servers[route.index];
  const target = `http://${server.Address}:${server.Port}`;
  proxy.web(req, res, { target });
});

app.listen(8080, () => console.log('Load balancer started on port 8080'));
