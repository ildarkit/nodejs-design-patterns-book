import express from 'express';
import { WorkerPool } from './workerPool.js';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/', function(req, res) {
  const functionName = req.body.functionName;
  const args = req.body.args; 
  const workers = new WorkerPool();
  workers.on('end', (data) => {
    console.log(
      new Date().toISOString(),
      `[INFO] ${data.code || 200}`,
      `response to the client ${req.hostname}`
    );
    res.status(data.code || 200).json(data);
  });
  workers.start({ functionName, args });
});

app.listen(
  3000,
  () => console.log('Server listening on localhost:3000'),
);
