import superagent from 'superagent';

export async function preloadAsyncData(path) {
  const { body } = await superagent.get(path);
  return body;
}
