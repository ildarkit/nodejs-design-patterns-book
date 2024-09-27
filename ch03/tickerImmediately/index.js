import { EventEmitter } from "events";

function tickEvent(number, cb) { 
  const ticker = new EventEmitter();
  let count = 0;
  const tick = (number) => {
    if (number) {
      count++;
      ticker.emit('tick', count);
      setImmediate(() => {
        tick(number - 1);
      });
    } else cb(count);
  };

  setImmediate(() => {
    tick(number);
  });
  return ticker;
}

tickEvent(10, (value) => console.log(`Tick count = ${value}`))
  .on('tick', (num) => console.log(`${num} tick`));
