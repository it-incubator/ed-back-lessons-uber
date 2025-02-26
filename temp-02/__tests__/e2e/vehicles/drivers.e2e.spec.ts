import request from 'supertest';
import express from 'express';

import {
  DriverStatus,
  VehicleFeature,
} from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const testDriverData: DriverInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: null,
    vehicleFeatures: [],
  };

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('should create driver; POST /api/drivers', async () => {
    const newDriver: DriverInputDto = {
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

    const createdDriverResponse = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send(newDriver)
      .expect(HttpStatus.Created);

    expect(createdDriverResponse.body.status).toBe(DriverStatus.AwaitingOrder);
  });

  it('should return drivers list; GET /api/drivers', async () => {
    await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HttpStatus.Created);

    const res = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...testDriverData, name: 'Another Driver2' })
      .expect(HttpStatus.Created);

    const response = await request(app)
      .get('/api/drivers')
      .expect(HttpStatus.Ok);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return driver by id; GET /api/drivers/:id', async () => {
    const createResponse = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/api/drivers/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('should update driver; PUT /api/drivers/:id', async () => {
    const createResponse = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HttpStatus.Created);

    const driverUpdateData: DriverInputDto = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await request(app)
      .put(`/api/drivers/${createResponse.body.id}`)
      .set('Authorization', adminToken)
      .send(driverUpdateData)
      .expect(HttpStatus.NoContent);

    const driverResponse = await request(app).get(
      `/api/drivers/${createResponse.body.id}`,
    );

    expect(driverResponse.body).toEqual({
      ...driverUpdateData,
      id: createResponse.body.id,
      createdAt: expect.any(String),
      status: DriverStatus.AwaitingOrder,
    });
  });

  it('should update driver status; PUT /api/drivers/:id/status', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HttpStatus.Created);

    const statusUpdateData = {
      status: DriverStatus.OnOrder,
    };

    await request(app)
      .put(`/api/drivers/${createdDriverId}/status`)
      .set('Authorization', adminToken)
      .send(statusUpdateData)
      .expect(HttpStatus.NoContent);

    const driverResponse = await request(app).get(
      `/api/drivers/${createdDriverId}`,
    );

    expect(driverResponse.body.status).toBe(DriverStatus.OnOrder);
  });

  it('DELETE /api/drivers/:id and check after NOT FOUND', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`/api/drivers/${createdDriverId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    const response = await request(app).get(`/api/drivers/${createdDriverId}`);
    expect(response.status).toBe(HttpStatus.NotFound);
  });
});
