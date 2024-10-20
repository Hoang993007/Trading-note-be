import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    name: 'Trading Note',
    env: 'development',
    prefixUrl: '/api',
    url: process.env.APP_URL || 'http://localhost:3000',
    merchantUrl: process.env.APP_MERCHANT_URL || 'http://localhost:3000',
    port: process.env.APP_PORT || 3119,
    swagger: {
      customSiteTitle: 'Trading Note API',
      title: 'Trading Note API',
      description: 'Swagger documentation for Trading Note APIs',
      version: process.env.SWAGGER_VERSION || '1.0.0',
      path: '/docs',
    },
    publicPath: process.env.PUBLIC_PATH || 'public',
    publicServeRoot: '/files',
  };
});
