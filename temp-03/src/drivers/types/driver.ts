export enum DriverStatus {
  OnOrder = 'on-order',
  Online = 'online',
  Offline = 'offline',
}

export enum VehicleFeature {
  WiFi = 'wi-fi',
  ChildSeat = 'child-seat',
  PetFriendly = 'pet-friendly',
}

export type Driver = {
  name: string;
  phoneNumber: string;
  email: string;
  status: DriverStatus;
  vehicle: {
    make: string; // e.g., Toyota
    model: string; // e.g., Camry
    year: number;
    licensePlate: string;
    description: string | null;
    features: VehicleFeature[];
  };
  createdAt: Date;
};
