import { Ride, RideStatus } from '../types/ride';
import { db } from '../../db/in-memory.db';
import { RideInputDto } from '../dto/ride-input.dto';
import { Driver } from '../../drivers/types/driver';

export const ridesRepository = {
  findAll(): Ride[] {
    return db.rides;
  },

  findById(id: number): Ride | null {
    return db.rides.find((d) => d.id === id) ?? null;
  },

  updateStatus(id: number, newStatus: RideStatus): boolean {
    const ride = db.rides.find((d) => d.id === id);

    if (!ride) {
      return false;
    }

    ride.status = newStatus;
    ride.updatedAt = new Date();

    return true;
  },

  createInProgressRide(driver: Driver, dto: RideInputDto): Ride {
    const newRide: Ride = {
      id: db.rides.length ? db.rides[db.rides.length - 1].id + 1 : 1,
      clientName: dto.clientName,
      driverId: dto.driverId,
      driverName: driver.name,
      vehicleLicensePlate: driver.vehicleLicensePlate,
      vehicleName: `${driver.vehicleMake} ${driver.vehicleModel}`,
      price: dto.price,
      currency: dto.currency,
      status: RideStatus.InProgress,
      createdAt: new Date(),
      updatedAt: null,
      address: {
        start: dto.startAddress,
        end: dto.endAddress,
      },
    };

    db.rides.push(newRide);

    return newRide;
  },
};
