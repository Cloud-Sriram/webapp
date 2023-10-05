const request = require('supertest');
const app = require('../server'); // Path to your express app

describe('Healthz Endpoint', () => {

//   //it('should return 200 OK when database is connected', async () => {
//     // Mock a successful db check
//     app.locals.db = {
//       checkDbConnection: (cb) => cb(null, true)
//     };

//     const response = await request(app).get('/healthz');
//     expect(response.statusCode).toBe(200);
//     expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
//   });

//   it('should return 503 when database is not connected', async () => {
//     // Mock a failed db check
//     app.locals.db = {
//       checkDbConnection: (cb) => cb(new Error("DB not connected"), false)
//     };

//     const response = await request(app).get('/healthz');
//     expect(response.statusCode).toBe(503);
//     expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
//   });

  it('should return 404 if request contains body or query', async () => {
    const responseWithBody = await request(app).get('/healthz').send({ key: 'value' });
    expect(responseWithBody.statusCode).toBe(404);

    const responseWithQuery = await request(app).get('/healthz?key=value');
    expect(responseWithQuery.statusCode).toBe(404);
  });

  it('should return 405 for non-GET requests', async () => {
    const postResponse = await request(app).post('/healthz');
    expect(postResponse.statusCode).toBe(405);
    expect(postResponse.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');

    // Similar checks for PUT, DELETE, etc.
  });
});