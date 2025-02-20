export enum VehicleStatus {
  OnOrder = 'on-order',
  AwaitingOrder = 'awaiting-order',
  OnPause = 'on-pause',
}

export enum VehicleFeature {
  WiFi = 'wi-fi',
  ChildSeat = 'child-seat',
  PetFriendly = 'pet-friendly',
}

export type Vehicle = {
  id: number;
  name: string;
  driver: string;
  status: VehicleStatus;
  number: number;
  createdAt: Date;
  description: string | null;
  features: VehicleFeature[] | null;
};
