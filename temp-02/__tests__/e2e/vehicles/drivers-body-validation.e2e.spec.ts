import request from 'supertest';
import {
  DriverStatus,
  VehicleFeature,
} from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import express from 'express';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestDriverData: DriverInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: 'Some description',
    vehicleFeatures: [VehicleFeature.ChildSeat],
  };

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it(`should not create driver when incorrect body passed; POST /api/drivers'`, async () => {
    await request(app)
      .post('/api/drivers')
      .send(correctTestDriverData)
      .expect(HttpStatus.Unauthorized);

    const response1 = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(response1.body.errorMessages).toHaveLength(4);

    const response2 = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleYear: 'year', // incorrect number
        vehicleLicensePlate: '', // empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(response2.body.errorMessages).toHaveLength(4);

    const response3 = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: 'A', // too shot
      })
      .expect(HttpStatus.BadRequest);

    expect(response3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const response = await request(app)
      .get('/api/drivers')
      .set('Authorization', adminToken);
    expect(response.body).toHaveLength(0);
  });

  it('should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...correctTestDriverData })
      .expect(HttpStatus.Created);

    const response1 = await request(app)
      .put(`/api/drivers/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(response1.body.errorMessages).toHaveLength(4);

    const response2 = await request(app)
      .put(`/api/drivers/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleYear: 'year', // incorrect number
        vehicleLicensePlate: '', // empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(response2.body.errorMessages).toHaveLength(4);

    const response3 = await request(app)
      .put(`/api/drivers/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: 'A', //too short
      })
      .expect(HttpStatus.BadRequest);

    expect(response3.body.errorMessages).toHaveLength(1);

    const driverResponse = await request(app)
      .get(`/api/drivers/${createdDriverId}`)
      .set('Authorization', adminToken);

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
      status: DriverStatus.Online,
    });
  });

  it('should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...correctTestDriverData })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`/api/drivers/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        vehicleFeatures: [
          VehicleFeature.ChildSeat,
          'invalid-feature',
          VehicleFeature.WiFi,
        ],
      })
      .expect(HttpStatus.BadRequest);

    const driverResponse = await request(app)
      .get(`/api/drivers/${createdDriverId}`)
      .set('Authorization', adminToken);

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
      status: DriverStatus.Online,
    });
  });

  it('should not update driver status when incorrect status passed; PUT /api/drivers/:id/status', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send({ ...correctTestDriverData })
      .expect(HttpStatus.Created);

    const driverBeforeUpdateResponse = await request(app).get(
      `/api/drivers/${createdDriverId}`,
    );

    await request(app)
      .put(`/api/drivers/${createdDriverId}/status`)
      .set('Authorization', adminToken)
      .send({ status: 'invalid-status' })
      .expect(HttpStatus.BadRequest);

    const driverAfterUpdateResponse = await request(app).get(
      `/api/drivers/${createdDriverId}`,
    );

    expect(driverAfterUpdateResponse.body.status).toBe(
      driverBeforeUpdateResponse.body.status,
    );
  });
});
