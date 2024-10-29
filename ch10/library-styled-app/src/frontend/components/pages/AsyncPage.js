import superagent from 'superagent';

export async function preloadAsyncData(path) {
  const { body } = await superagent
    .get(path)
    .timeout({ response: 5000 });
  return body;
}
