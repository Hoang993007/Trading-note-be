import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => {
  return {
    host: process.env.EMAIL_HOST,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    emailSender: process.env.EMAIL_SENDER,
  };
});
