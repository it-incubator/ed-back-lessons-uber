import { Ride, RideStatus } from '../types/ride';
import { rideCollection } from '../../db/mongo.db';
import { ClientSession, ObjectId, WithId } from 'mongodb';

export const ridesRepository = {
  async findAll(): Promise<WithId<Ride>[]> {
    return rideCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Ride> | null> {
    return rideCollection.findOne({ _id: new ObjectId(id) });
  },

  async updateStatus(
    id: string,
    newStatus: RideStatus,
    session: ClientSession,
  ): Promise<void> {
    const updateResult = await rideCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status: newStatus,
          finishedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { session },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Ride not exist');
    }

    return;
  },

  async createRide(
    newRide: Ride,
    session: ClientSession,
  ): Promise<WithId<Ride>> {
    const insertResult = await rideCollection.insertOne(newRide, { session });

    return { ...newRide, _id: insertResult.insertedId };
  },
};
