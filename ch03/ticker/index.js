import { EventEmitter } from "events";

function tickEvent(number, cb) { 
  const ticker = new EventEmitter();
  let count = 0;
  const tick = (number) => {
    if (number) {
      count++;
      ticker.emit('tick', count);
      setTimeout(() => {
        tick(number - 1);
      }, 50);
    } else cb(count);
  };

  setTimeout(() => {
    tick(number);
  }, 50);
  return ticker;
}

tickEvent(10, (value) => console.log(`Tick count = ${value}`))
  .on('tick', (num) => console.log(`${num} tick`));
