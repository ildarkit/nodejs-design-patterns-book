import functions from './functions.js';

export const dispatch = new Map(
  Object.values(functions).map(f => [f.name, f])
);
