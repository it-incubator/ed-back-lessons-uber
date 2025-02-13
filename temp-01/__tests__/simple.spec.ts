import { initApp } from '../src/init-app';

describe('simple', () => {
  beforeAll(() => {
    initApp();
  });

  it('test', () => {
    expect(true).toBe(true);
  });
});
