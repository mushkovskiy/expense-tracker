const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:3000',
};
