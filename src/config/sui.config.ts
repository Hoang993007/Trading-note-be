import { registerAs } from '@nestjs/config';

export default registerAs('sui', () => {
  return {
    network: process.env.SUI_NETWORK || 'testnet',
    suiSponsorSks: process.env.SUI_SPONSOR_SKS?.split(',') || [],
    operatorSk: process.env.SUI_OPERATOR_SK,
  };
});
