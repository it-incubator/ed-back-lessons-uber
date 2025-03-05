import { Driver, DriverStatus } from '../types/driver';
import { db } from '../../db/in-memory.db';
import { DriverInputDto } from '../dto/driver.input-dto';

export const driversRepository = {
  findAll(): Driver[] {
    return db.drivers;
  },

  findById(id: number): Driver | null {
    return db.drivers.find((d) => d.id === id) ?? null;
  },

  create(dto: DriverInputDto): Driver {
    const newDriver: Driver = {
      id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      status: DriverStatus.Online,
      vehicleMake: dto.vehicleMake,
      vehicleModel: dto.vehicleModel,
      vehicleYear: dto.vehicleYear,
      vehicleLicensePlate: dto.vehicleLicensePlate,
      vehicleDescription: dto.vehicleDescription,
      vehicleFeatures: dto.vehicleFeatures,
      createdAt: new Date(),
    };

    db.drivers.push(newDriver);

    return newDriver;
  },

  update(id: number, dto: DriverInputDto): boolean {
    const driver = db.drivers.find((d) => d.id === id);

    if (!driver) {
      return false;
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

    return true;
  },

  updateStatus(id: number, newStatus: DriverStatus): boolean {
    const driver = db.drivers.find((d) => d.id === id);

    if (!driver) {
      return false;
    }

    driver.status = newStatus;
    return true;
  },

  delete(id: number): boolean {
    const index = db.drivers.findIndex((v) => v.id === id);

    if (index === -1) {
      return false;
    }

    db.drivers.splice(index, 1);
    return true;
  },
};
