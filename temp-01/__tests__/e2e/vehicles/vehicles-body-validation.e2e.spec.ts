import request from 'supertest';
import { db } from '../../../src/db/in-memory.db';
import {
  Vehicle,
  VehicleFeature,
  VehicleStatus,
} from '../../../src/vehicles/types/vehicle';
import { initApp } from '../../../src/init-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';

describe('Vehicle API body validation check', () => {
  const app = initApp();

  const testVehicleData: Vehicle = {
    id: 1,
    name: 'BMW',
    driver: 'Valentin',
    status: VehicleStatus.AwaitingOrder,
    number: 123,
    createdAt: new Date(),
    description: null,
    features: null,
  };

  beforeEach(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
    db.vehicles = [testVehicleData];
  });

  it(`should not create vehicle when incorrect body passed; POST /api/vehicles'`, async () => {
    await request(app)
      .post('/api/vehicles')
      .send({
        name: '   ',
        driver: '    ',
        number: 456,
      })
      .expect(HttpStatus.BadRequest);

    await request(app)
      .post('/api/vehicles')
      .send({
        name: 'some name',
        driver: '',
        number: 456,
      })
      .expect(HttpStatus.BadRequest);

    await request(app)
      .post('/api/vehicles')
      .send({
        name: 'some name',
        driver: 'driver',
        number: true,
      })
      .expect(HttpStatus.BadRequest);

    await request(app)
      .post('/api/vehicles')
      .send({
        name: '1',
        driver: 'driver',
        number: 123,
      })
      .expect(HttpStatus.BadRequest);

    await request(app)
      .post('/api/vehicles')
      .send({
        name: '1234567890123456',
        driver: 'driver',
        number: 123,
      })
      .expect(HttpStatus.BadRequest);

    await request(app)
      .post('/api/vehicles')
      .send({
        name: '12345',
        driver: '1234567890123456789012',
        number: 123,
      })
      .expect(HttpStatus.BadRequest);

    expect(db.vehicles).toHaveLength(1);
  });

  it('should not update vehicle when incorrect data passed; PUT /api/vehicles/:id', async () => {
    const vehicleBody = {
      driver: 'new driver new driver new driver new driver',
      name: 'new name',
      number: 'number',
      description: 't',
    };

    const updateResponse = await request(app)
      .put('/api/vehicles/1')
      .send(vehicleBody)
      .expect(HttpStatus.BadRequest);

    expect(updateResponse.body.errorMessages).toHaveLength(3);

    const vehicleResponse = await request(app).get(`/api/vehicles/1`);

    expect(vehicleResponse.body).toEqual({
      ...testVehicleData,
      createdAt: expect.any(String),
    });
  });

  it('should not update vehicle when incorrect features passed; PUT /api/vehicles/:id', async () => {
    const vehicleBody = {
      driver: 'new driver',
      name: 'new name',
      number: 123,
      features: [VehicleFeature.ChildSeat, 'incorrect', VehicleFeature.WiFi],
    };

    await request(app)
      .put('/api/vehicles/1')
      .send(vehicleBody)
      .expect(HttpStatus.BadRequest);

    const vehicleResponse = await request(app).get(`/api/vehicles/1`);

    expect(vehicleResponse.body).toEqual({
      ...testVehicleData,
      createdAt: expect.any(String),
    });
  });

  it('should not update vehicle status when incorrect status passed; PUT /api/vehicles/:id/status', async () => {
    const vehicleBody = {
      status: 'incorrect',
    };

    await request(app)
      .put('/api/vehicles/1/status')
      .send(vehicleBody)
      .expect(HttpStatus.BadRequest);

    const vehicleResponse = await request(app).get(`/api/vehicles/1`);

    expect(vehicleResponse.body.status).toBe(testVehicleData.status);
  });
});
