import 'reflect-metadata';
import { app } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`API server listening on port ${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
