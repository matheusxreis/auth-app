import express from 'express';

export function createServer () {
  const api = express();
  api.use(express.json());

  api.get('/signin', (req, res) => {
    return res.json({ token: 'asasasa', user: { id: '9182j2j2', username: 'i12jui12j2' }, timestamp: new Date().getTime() });
  });

  return api;
};
