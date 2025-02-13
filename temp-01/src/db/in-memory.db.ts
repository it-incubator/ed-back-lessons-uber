import { Vehicle, VehicleStatus } from '../vehicles/types/vehicle';

export const db = {
  vehicles: <Vehicle[]>[
    {
      id: 1,
      name: 'BMW Cabrio',
      driver: 'Tom Rider',
      status: VehicleStatus.OnOrder,
      number: 32145,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Mustang Shelby GT',
      driver: 'Tom Rider',
      status: VehicleStatus.AwaitingOrder,
      number: 21342,
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'BMW 18',
      driver: 'Tom Rider',
      status: VehicleStatus.OnOrder,
      number: 31234,
      createdAt: new Date(),
    },
  ],
};
