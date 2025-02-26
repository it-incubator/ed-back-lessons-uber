import { Ride, RideStatus } from '../types/ride';
import { db } from '../../db/in-memory.db';
import { RideInputDto } from '../dto/ride-input.dto';
import { Driver } from '../../drivers/types/driver';

export const ridesRepository = {
  async findAll(): Promise<Ride[]> {
    return db.rides;
  },

  async findById(id: number): Promise<Ride | null> {
    return db.rides.find((d) => d.id === id) ?? null;
  },

  async updateStatus(id: number, newStatus: RideStatus): Promise<boolean> {
    const ride = db.rides.find((d) => d.id === id);

    if (!ride) {
      return false;
    }

    ride.status = newStatus;
    return true;
  },

  async create(driver: Driver, dto: RideInputDto): Promise<Ride> {
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
