import { defineConfig } from 'drizzle-kit';
import env from './utils/env'

export default defineConfig({
  schema: './src/**/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true
});