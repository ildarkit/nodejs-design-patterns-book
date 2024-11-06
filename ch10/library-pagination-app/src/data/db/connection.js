import { Sequelize } from 'sequelize';

async function connect() {
  const user = process.env.PG_USERNAME;
  const password = process.env.PG_PASSWORD;
  const host = process.env.PG_HOST;
  const port = process.env.PG_PORT;
  const db = process.env.PG_DATABASE;

  const sequelize = new Sequelize(
    `postgres://${user}:${password}@${host}:${port}/${db}`
  );
  try {
    await sequelize.authenticate();
  } catch (e) {
    console.error('Unable to connect to the database:', e);
  }
  return sequelize;
}

export const connection = await connect();
