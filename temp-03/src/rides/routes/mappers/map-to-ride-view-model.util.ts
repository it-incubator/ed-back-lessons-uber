import { WithId } from 'mongodb';
import { Ride } from '../../types/ride';
import { RideViewModel } from '../../types/ride-view-model';

export function mapToRideViewModelUtil(ride: WithId<Ride>): RideViewModel {
  return {
    id: ride._id.toString(),
    clientName: ride.clientName,
    driver: ride.driver,
    vehicle: ride.vehicle,
    price: ride.price,
    currency: ride.currency,
    status: ride.status,
    startedAt: ride.startedAt,
    finishedAt: ride.finishedAt,
    addresses: ride.addresses,
  };
}
