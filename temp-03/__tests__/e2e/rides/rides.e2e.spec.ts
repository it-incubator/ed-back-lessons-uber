// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { clearDb } from '../../utils/clear-db';
import { createRide } from '../../utils/rides/create-ride';
import { RIDES_PATH } from '../../../src/core/paths/paths';
import { getRideById } from '../../utils/rides/get-ride-by-id';
import { runDB, stopDb } from '../../../src/db/mongo.db';

describe('Rides API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/ed-back-lessons-uber-test');
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('✅ should create ride; POST /api/rides', async () => {
    await createRide(app);
  });

  it('✅ should return rides list; GET /api/rides', async () => {
    await createRide(app);

    const rideListResponse = await request(app)
      .get(RIDES_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(rideListResponse.body).toBeInstanceOf(Array);
    expect(rideListResponse.body).toHaveLength(2);
  });

  it('✅ should return ride by id; GET /api/rides/:id', async () => {
    const createdRide = await createRide(app);

    const getRide = await getRideById(app, createdRide.id);

    expect(getRide).toEqual({
      ...createdRide,
      id: expect.any(String),
      startedAt: expect.any(String),
      finishedAt: null,
    });
  });

  it('✅ should finish ride; POST /api/rides/:id/actions/finish', async () => {
    const createdRide = await createRide(app);

    await request(app)
      .post(`${RIDES_PATH}/${createdRide.id}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    const getRide = await getRideById(app, createdRide.id);

    expect(getRide).toEqual({
      ...createdRide,
      finishedAt: expect.any(String),
    });
  });
});
