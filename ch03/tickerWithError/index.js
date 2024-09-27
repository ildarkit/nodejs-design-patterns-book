import { EventEmitter } from "events";

function tickEvent(number, cb) { 
  const ticker = new EventEmitter();
  let count = 0;
  const tick = (number) => {
    if (number) {
      count++;
      if (Date.now() % 5 === 0) {
        const err = new Error('Timestamp is divisable by 5');
        ticker.emit('error', err);
        setImmediate(() => cb(err));
      }
      else 
        ticker.emit('tick', count);
      setImmediate(() => {
        tick(number - 1);
      });
    } else 
      setImmediate(() => cb(null, count));
  };

  setImmediate(() => {
    tick(number);
  });
  return ticker;
}

tickEvent(10, (err, value) => {
  if (err)
    console.error(`Callback: ${err.message}`);
  else
    console.log(`Tick count = ${value}`);
})
  .on('tick', (num) => console.log(`${num} tick`))
  .on('error', (err) => console.log(`Emitter: ${err.message}`));
