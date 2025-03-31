import { Driver } from '../types/driver';
import { db } from '../../db/in-memory.db';
import { DriverInputDto } from '../dto/driver.input-dto';

export const driversRepository = {
  findAll(): Driver[] {
    return db.drivers;
  },

  findById(id: number): Driver | null {
    return db.drivers.find((d) => d.id === id) ?? null;
  },

  create(newDriver: Driver): Driver {
    db.drivers.push(newDriver);

    return newDriver;
  },

  update(id: number, dto: DriverInputDto): void {
    const driver = db.drivers.find((d) => d.id === id);

    if (!driver) {
      throw new Error('Driver not exist');
    }

    driver.name = dto.name;
    driver.phoneNumber = dto.phoneNumber;
    driver.email = dto.email;
    driver.vehicleMake = dto.vehicleMake;
    driver.vehicleModel = dto.vehicleModel;
    driver.vehicleYear = dto.vehicleYear;
    driver.vehicleLicensePlate = dto.vehicleLicensePlate;
    driver.vehicleDescription = dto.vehicleDescription;
    driver.vehicleFeatures = dto.vehicleFeatures;

    return;
  },

  delete(id: number): void {
    const index = db.drivers.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new Error('Driver not exist');
    }

    db.drivers.splice(index, 1);
    return;
  },
};
