import { createServer } from './createServer';

function initServer () {
  const api = createServer();
  api.listen(3333, () => {
    console.log('The server is running on port 3333...');
  });
}

initServer();
