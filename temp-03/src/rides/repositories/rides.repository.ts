import { Ride } from '../types/ride';
import { rideCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const ridesRepository = {
  async findAll(): Promise<WithId<Ride>[]> {
    return rideCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Ride> | null> {
    return rideCollection.findOne({ _id: new ObjectId(id) });
  },

  async findActiveRideByDriverId(
    driverId: string,
  ): Promise<WithId<Ride> | null> {
    return rideCollection.findOne({ driverId, finishedAt: null });
  },

  async createRide(newRide: Ride): Promise<WithId<Ride>> {
    const insertResult = await rideCollection.insertOne(newRide);

    return { ...newRide, _id: insertResult.insertedId };
  },

  async finishedRide(id: string) {
    const updateResult = await rideCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          finishedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Ride not exist');
    }

    return;
  },
};
