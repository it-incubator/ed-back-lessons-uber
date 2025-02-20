import request from 'supertest';

import {
  Vehicle,
  VehicleFeature,
  VehicleStatus,
} from '../../../src/vehicles/types/vehicle';
import { initApp } from '../../../src/init-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { db } from '../../../src/db/in-memory.db';

describe('Vehicle API', () => {
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

  it('should return vehicles list; GET /api/vehicles', async () => {
    db.vehicles = [
      ...db.vehicles,
      { ...testVehicleData, id: 2 },
      { ...testVehicleData, id: 3 },
    ];

    const response = await request(app)
      .get('/api/vehicles')
      .expect(HttpStatus.Ok);

    expect(response.body).toHaveLength(3);
    expect(response.body[2].id).toBe(3);
  });

  it('should return vehicle by id; GET /api/vehicle/:id', async () => {
    const response = await request(app)
      .get(`/api/vehicles/1`)
      .expect(HttpStatus.Ok);

    expect(response.body).toEqual({
      ...testVehicleData,
      createdAt: testVehicleData.createdAt.toISOString(),
    });
  });

  it(`should create vehicle; POST /api/vehicles. By default status should be 'awaiting-order'`, async () => {
    const newVehicle = {
      name: 'Audi',
      driver: 'Feodor',
      number: 456,
    };

    const createdVehicleResponse = await request(app)
      .post('/api/vehicles')
      .send(newVehicle)
      .expect(HttpStatus.Created);

    expect(createdVehicleResponse.body.status).toBe(
      VehicleStatus.AwaitingOrder,
    );

    const vehicleResponse = await request(app).get(
      `/api/vehicles/${createdVehicleResponse.body.id}`,
    );

    expect(vehicleResponse.body).toEqual({
      ...newVehicle,
      id: createdVehicleResponse.body.id,
      createdAt: createdVehicleResponse.body.createdAt,
      status: VehicleStatus.AwaitingOrder,
      description: null,
      features: null,
    });
  });

  it('should update vehicle; PUT /api/vehicles/:id', async () => {
    const vehicleBody = {
      driver: 'new driver',
      name: 'new name',
      description: 'this is supercar',
      number: 123,
      features: [VehicleFeature.ChildSeat],
    };

    await request(app)
      .put('/api/vehicles/1')
      .send(vehicleBody)
      .expect(HttpStatus.NoContent);

    const vehicleResponse = await request(app).get(`/api/vehicles/1`);

    expect(vehicleResponse.body).toEqual({
      ...vehicleBody,
      id: 1,
      createdAt: expect.any(String),
      status: VehicleStatus.AwaitingOrder,
    });
  });

  it('should update vehicle status; PUT /api/vehicles/:id/status', async () => {
    const vehicleBody = {
      status: VehicleStatus.OnOrder,
    };

    await request(app)
      .put('/api/vehicles/1/status')
      .send(vehicleBody)
      .expect(HttpStatus.NoContent);

    const vehicleResponse = await request(app).get(`/api/vehicles/1`);

    expect(vehicleResponse.body.status).toBe(VehicleStatus.OnOrder);
  });

  it('DELETE /api/vehicles/:id', async () => {
    const response = await request(app).delete('/api/vehicles/1');
    expect(response.status).toBe(HttpStatus.NoContent);

    expect(db.vehicles).toHaveLength(0);
  });
});
