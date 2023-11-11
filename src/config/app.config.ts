import { generateJwtSecret } from '@/shared/utils';

export default () => ({
  port: process.env.APP_PORT || 4000,
  host: process.env.APP_HOST || '0.0.0.0',
  environment: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  apiPrefix: process.env.APP_API_PREFIX || 'api',
  apiVersion: process.env.APP_API_VERSION || 'v1',
  apiDocsPath: process.env.APP_API_DOCS_PATH || 'docs',
  jwtSecret: process.env.APP_JWT_SECRET || generateJwtSecret(),
});
