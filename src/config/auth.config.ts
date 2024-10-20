import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
  return {
    jwt: {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    },
    root: process.env.ROOT_EMAIL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
  };
});
