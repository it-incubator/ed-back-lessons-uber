import request from 'supertest';
import { db } from '../../../src/db/in-memory.db';
import { Vehicle, VehicleStatus } from '../../../src/vehicles/types/vehicle';
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
  };

  beforeEach(() => {
    db.vehicles = [testVehicleData];
  });

  it(`should not create vehicle when incorrect body passed; POST /api/vehicles'`, async () => {
    await request(app)
      .post('/api/vehicles')
      .send({
        name: '   ',
        driver: '',
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

  it('should not update vehicle when incorrect status passed; PUT /api/vehicles/:id', async () => {
    const vehicleBody = {
      driver: 'new driver',
      name: 'new name',
      status: 'incorrect status',
      number: 123,
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
});
