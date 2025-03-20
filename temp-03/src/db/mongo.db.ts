import { Collection, Db, MongoClient } from 'mongodb';
import { Driver } from '../drivers/types/driver';
import { Ride } from '../rides/types/ride';
import { SETTINGS } from '../core/settings/settings';

const DRIVER_COLLECTION_NAME = 'drivers';
const RIDE_COLLECTION_NAME = 'rides';

export let client: MongoClient;
export let driverCollection: Collection<Driver>;
export let rideCollection: Collection<Ride>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  //Инициализация коллекций
  driverCollection = db.collection<Driver>(DRIVER_COLLECTION_NAME);
  rideCollection = db.collection<Ride>(RIDE_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
