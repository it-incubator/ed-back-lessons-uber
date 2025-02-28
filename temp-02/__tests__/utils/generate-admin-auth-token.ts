import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../src/accounts/middlewares/super-admin.guard-middleware';

export function generateBasicAuthToken() {
  const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
  const token = Buffer.from(credentials).toString('base64');
  return `Basic ${token}`;
}
