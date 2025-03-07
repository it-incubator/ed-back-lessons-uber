import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverStatus } from '../../../src/drivers/types/driver';
import { RideInputDto } from '../../../src/rides/dto/ride-input.dto';
import { Currency, RideStatus } from '../../../src/rides/types/ride';
import { createDriver } from '../../utils/create-driver';

describe('Rides API', () => {
  const app = express();
  setupApp(app);

  const testRideData: Partial<RideInputDto> = {
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    startAddress: '123 Main St, Springfield, IL',
    endAddress: '456 Elm St, Shelbyville, IL',
  };

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('should create ride; POST /api/rides', async () => {
    const driver = await createDriver(app);

    const createdRideResponse = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({ ...testRideData, driverId: driver.id })
      .expect(HttpStatus.Created);

    expect(createdRideResponse.body.status).toBe(RideStatus.InProgress);
  });

  it('should return rides list; GET /api/rides', async () => {
    const driver2 = await createDriver(app, {
      name: 'Sam',
      email: 'sam@example.com',
    });

    await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({ ...testRideData, driverId: driver2.id })
      .expect(HttpStatus.Created);

    const rideListResponse = await request(app)
      .get('/api/rides')
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(rideListResponse.body).toBeInstanceOf(Array);
    expect(rideListResponse.body).toHaveLength(2);
  });

  it('should return ride by id; GET /api/rides/:id', async () => {
    const driver = await createDriver(app);

    const createResponse = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({ ...testRideData, driverId: driver.id })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/api/rides/${createResponse.body.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('should finish ride; PUT /api/rides/:id/finish', async () => {
    const driver = await createDriver(app);

    const createResponse = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({ ...testRideData, driverId: driver.id })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`/api/rides/${createResponse.body.id}/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    const rideResponse = await request(app)
      .get(`/api/rides/${createResponse.body.id}`)
      .set('Authorization', adminToken);

    expect(rideResponse.body).toEqual({
      ...createResponse.body,
      status: RideStatus.Finished,
      updatedAt: expect.any(String),
    });

    const driverResponse = await request(app)
      .get(`/api/drivers/${createResponse.body.driverId}`)
      .set('Authorization', adminToken);

    expect(driverResponse.body).toEqual({
      ...driver,
      status: DriverStatus.Online,
    });
  });
});
