import express from 'express';
import { setupApp } from './setup-app';

// startApp + setup
const bootstrap = async () => {
  const app = express();

  setupApp(app);

  const PORT = process.env.PORT || 5001;

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
  return app;
};

bootstrap();
