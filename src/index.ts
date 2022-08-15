import { config as loadEnvVariables } from 'dotenv';
import { DatabaseService } from './auth/infra/helpers/db/databaseService';
import { createServer } from './createServer';

loadEnvVariables();

function initServer () {
  const api = createServer();
  api.listen(process.env.PORT, () => {
    console.log(`The server is running on port ${process.env.PORT}...`);
  });
}

async function initServices () {
  initServer();
  await DatabaseService.init();
}

initServices();
