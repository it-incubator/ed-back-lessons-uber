import { WithId } from 'mongodb';
import { Ride } from '../../types/ride';
import { RideViewModel } from '../../types/ride-view-model';

export function createRideViewModelUtil(ride: WithId<Ride>): RideViewModel {
  return {
    id: ride._id.toString(),
    clientName: ride.clientName,
    driverId: ride.driverId,
    driverName: ride.driverName,
    vehicleLicensePlate: ride.vehicleLicensePlate,
    vehicleName: ride.vehicleName,
    price: ride.price,
    currency: ride.currency,
    status: ride.status,
    startedAt: ride.startedAt,
    finishedAt: ride.finishedAt,
    addresses: ride.addresses,
  };
}
