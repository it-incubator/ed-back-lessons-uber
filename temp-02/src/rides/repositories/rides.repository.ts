import { Ride, RideStatus } from '../types/ride';
import { db } from '../../db/in-memory.db';

export const ridesRepository = {
  findAll(): Ride[] {
    return db.rides;
  },

  findById(id: number): Ride | null {
    return db.rides.find((d) => d.id === id) ?? null;
  },

  updateStatus(id: number, newStatus: RideStatus): void {
    const ride = db.rides.find((d) => d.id === id);

    if (!ride) {
      throw new Error('Ride does not exist');
    }

    ride.status = newStatus;
    ride.updatedAt = new Date();

    return;
  },

  createRide(newRide: Ride): Ride {
    db.rides.push(newRide);

    return newRide;
  },
};
