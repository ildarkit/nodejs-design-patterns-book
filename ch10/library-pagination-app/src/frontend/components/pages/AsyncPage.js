import superagent from 'superagent';
import { tailUrl } from '../helpers.js';

const api = 'http://localhost:3001/api';

export async function asyncApiContent({ url }) {
  const path = `${api}${tailUrl(url)}`;
  const { body } = await superagent
    .get(path)
    .timeout({ response: 5000 });
  return body;
}
