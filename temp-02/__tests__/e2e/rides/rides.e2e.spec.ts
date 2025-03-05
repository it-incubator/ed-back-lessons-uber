import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Driver, DriverStatus } from '../../../src/drivers/types/driver';
import { RideInputDto } from '../../../src/rides/dto/ride-input.dto';
import { Currency, RideStatus } from '../../../src/rides/types/ride';

describe('Rides API', () => {
  const app = express();
  setupApp(app);

  const testDriverData: DriverInputDto = {
    name: 'Feodor',
    phoneNumber: '987-654-3210',
    email: 'feodor@example.com',
    vehicleMake: 'Audi',
    vehicleModel: 'A6',
    vehicleYear: 2020,
    vehicleLicensePlate: 'XYZ-456',
    vehicleDescription: null,
    vehicleFeatures: [],
  };

  let driver: Driver;

  const testRideData: Partial<RideInputDto> = {
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    startAddress: '123 Main St, Springfield, IL',
    endAddress: '456 Elm St, Shelbyville, IL',
  };

  const adminToken = generateBasicAuthToken();
  //todo beforeAll
  beforeEach(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);

    //todo create helper to createDriver
    const createdDriverResponse = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send(testDriverData)
      .expect(HttpStatus.Created);

    driver = createdDriverResponse.body;
  });

  it('should create ride; POST /api/rides', async () => {
    const createdRideResponse = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({ ...testRideData, driverId: driver.id })
      .expect(HttpStatus.Created);

    expect(createdRideResponse.body.status).toBe(RideStatus.InProgress);
  });

  it('should return rides list; GET /api/rides', async () => {
    const createdDriverResponse2 = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...testDriverData, name: 'Sam', email: 'sam@example.com' })
      .expect(HttpStatus.Created);

    const driver2 = createdDriverResponse2.body;

    await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({ ...testRideData, driverId: driver2.id })
      .expect(HttpStatus.Created);

    const response = await request(app)
      .get('/api/rides')
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it('should return ride by id; GET /api/rides/:id', async () => {
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

  it('should update ride status; PUT /api/rides/:id/status', async () => {
    const createResponse = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({ ...testRideData, driverId: driver.id })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`/api/rides/${createResponse.body.id}/status`)
      .set('Authorization', adminToken)
      .send({ status: RideStatus.Finished })
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
      status: DriverStatus.AwaitingOrder,
    });
  });
});
