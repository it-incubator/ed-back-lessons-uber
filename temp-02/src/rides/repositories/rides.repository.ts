import { Ride } from '../types/ride';
import { db } from '../../db/in-memory.db';

export const ridesRepository = {
  findAll(): Ride[] {
    return db.rides;
  },

  findById(id: number): Ride | null {
    return db.rides.find((d) => d.id === id) ?? null;
  },

  createRide(newRide: Ride): Ride {
    db.rides.push(newRide);

    return newRide;
  },
};
