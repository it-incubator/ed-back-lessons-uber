export enum VehicleStatus {
  OnOrder = 'on-order',
  AwaitingOrder = 'awaiting-order',
  OnPause = 'on-pause',
}

export type Vehicle = {
  id: number;
  name: string;
  driver: string;
  status: VehicleStatus;
  number: number;
  createdAt: Date;
};
