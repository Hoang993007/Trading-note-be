import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    mongodb: {
      uri:
        process.env.NODE_ENV === 'TEST'
          ? process.env.MONGODB_URI_TESTING
          : process.env.MONGODB_URI,
    },
  };
});
