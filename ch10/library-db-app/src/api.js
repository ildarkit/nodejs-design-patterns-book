import 'dotenv/config';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { Repository } from './data/repo.js';

const server = fastify({ logger: true });

server.decorate('repository', new Repository());
server.register(fastifyCors, { origin: true });

server.get('/api/authors/',
  async function (req, reply) {
    return await this.repository.getAuthors();
  }
)

server.get('/api/author/:authorId',
  async function (req, reply) {
    const author = await this.repository.getAuthorInfo(req.params.authorId);
    if (!author) {
      reply.code(404);
      return { error: 'Author not found' };
    }
    return author;
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
