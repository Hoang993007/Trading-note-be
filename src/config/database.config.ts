import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    mongodb: {
      uri: process.env.MONGODB_URI,
    },
  };
});
