import express from 'express';
import { WorkerPool } from './workerPool.js';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/', function(req, res) {
  const functionName = req.body.functionName;
  const args = req.body.args;
  const pool = new WorkerPool();
  pool.on('end', (data) => {
    res.status(data.code || 200).json(data);
  });
  pool.start({ functionName, args });
});

app.listen(
  3000,
  () => console.log('Server started at localhost:3000'),
);
