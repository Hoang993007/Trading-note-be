import { registerAs } from '@nestjs/config';

export default registerAs('merchant', () => {
  return {
    packageId: process.env.PACKAGE_ID,
    merchantFactoryObjectId: process.env.MERCHANT_FACTORY_OBJECT_ID,
    merchantOperatorObjectId: process.env.MERCHANT_OPERATOR_OBJECT_ID,
    sbtExpireTime: 7 * 24 * 60 * 60 * 1000, //7 days in ms
    clock: '0x6',
  };
});
