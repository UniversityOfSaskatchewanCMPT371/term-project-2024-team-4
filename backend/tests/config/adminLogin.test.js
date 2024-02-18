const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = require('../../routes/users');

// Mock the database connection
jest.mock('../../config/db.js', () => {
  const { DataSource } = require('typeorm');
  return {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      save: jest.fn(),
    }),
    initialize: jest.fn(),
  };
});

// Setup Express app to parse JSON
app.use(bodyParser.json());
app.use('/users', router);

describe('User API endpoints', () => {

    it('should get user', async () => {
        const res = await request(app)
          .get('/users')
        expect(res.statusCode).toEqual(201);
        expect(res.body.user.userName).toEqual('admin');
        expect(res.body.user.password).toEqual('admin');
      });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('First user successfully created');
    expect(res.body.user.userName).toEqual('admin');
    expect(res.body.user.password).toEqual('admin');
  });

  it('should log in existing user with correct credentials', async () => {
    // Send a POST request with existing user's credentials
    const res = await request(app)
      .post('/users')
      .send({ userName: 'admin', password: 'admin' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User successfully logged in');
    expect(res.body.user.userName).toEqual('admin');
    expect(res.body.user.password).toEqual('admin');
  });

  it('should return unauthorized for login with incorrect password', async () => {
    // Send a POST request with existing username and incorrect password
    const res = await request(app)
      .post('/users')
      .send({ userName: 'admin', password: 'wrongpassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

  it('should return unauthorized for login with incorrect username', async () => {
    // Send a POST request with existing username and incorrect password
    const res = await request(app)
      .post('/users')
      .send({ userName: 'wrongadmin', password: 'admin' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });


  it('should update username and password for existing user', async () => {
    // Send a PATCH request to update username
    const userId = 1; // Assuming a user with ID 1 exists
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ userName: 'newusername', password: 'newpassword'  });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User successfully updated');
    expect(res.body.user.userName).toEqual('newusername');
  });

  it('should update username for existing user', async () => {
    // Send a PATCH request to update username
    const userId = 1; // Assuming a user with ID 1 exists
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ userName: 'newusername' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User successfully updated');
    expect(res.body.user.userName).toEqual('newusername');
  });

  it('should update password for existing user', async () => {
    // Send a PATCH request to update password
    const userId = 1; // Assuming a user with ID 1 exists
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ password: 'newpassword' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User successfully updated');

  });

  it('should update password for non-existing user', async () => {
    // Send a PATCH request to update password
    const res = await request(app)
      .patch(`/users/999`)
      .send({ password: 'newpassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('No user exist');

  });

});
