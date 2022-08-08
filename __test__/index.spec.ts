import supertest from 'supertest';
import { createServer } from '../src/createServer';

beforeAll(done => done());
afterAll(done => done());

const api = createServer();

describe('POST /signin', () => {
  it('should return a response status 200', (done) => {
    supertest(api)
      .get('/signin')
      .end((err, res) => {
        expect(res.statusCode).toBe(200);

        if (err) { done(err); }
        done();
      });
    done();
  });

  it('should return a response body correctly', async () => {
    const res = await supertest(api)
      .get('/signin');

    // testing properties from response.body;
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('timestamp');

    // testing properties from response.body.user;
    const user = res.body.user;

    expect(user).toHaveProperty('id');

    // testing timestamp from response.body, it must be a number which represents now;
    const timestamp = res.body.timestamp;
    const timestampDate = new Date(timestamp);

    expect(typeof timestamp).toBe('number');
    expect(new Date().getMinutes()).toBe(timestampDate.getMinutes());
    expect(new Date().getHours()).toBe(timestampDate.getHours());
    expect(new Date().getDay()).toBe(timestampDate.getDay());

    // testing type of response.body.token, it must be a string;
    const token = res.body.token;
    expect(typeof token).toBe('string');
  });
});
