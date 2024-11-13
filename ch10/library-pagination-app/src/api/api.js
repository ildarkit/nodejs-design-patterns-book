import 'dotenv/config';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { Repository } from '../data/repo.js';

const server = fastify({ logger: true });

server.decorate('repository', new Repository());
server.register(fastifyCors, { origin: true });

server.get('/api/authors',
  async function (req, reply) {
    return await this.repository.getAuthors(req.query);
  }
)

server.get('/api/author/:authorId',
  async function (req, reply) {
    const response = await this.repository
      .getAuthorInfo({
        slug: req.params.authorId,
        ...req.query
      });
    if (!response.result.author) {
      reply.code(404);
      return { error: 'Author not found' };
    }
    return response;
  }
)

const port = Number.parseInt(process.env.PORT) || 3001;
const host = process.env.ADDRESS || '127.0.0.1';

server.listen({ port, host }, function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
})
