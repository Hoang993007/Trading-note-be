import { ConfigNotFoundException } from '../exceptions/common.exception';

export const autoImport = (module) => {
  return Object.keys(module).map((moduleName) => module[moduleName]);
};

export const getEnumValues = (enumType: unknown) => {
  return Object.keys(enumType).map((key) => enumType[key]);
};

export const validateConfig = (config: { [key: string]: any }) => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined || value === null) {
      throw new ConfigNotFoundException(key);
    }
  }
};

export const getNowUnixTimeStamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const getCookie = (name: string, cookies: string) => {
  const cookie = cookies
    .split(';')
    .find((cookie) => cookie.trim().startsWith(`${name}=`));
  if (!cookie) {
    return null;
  }
  return cookie.split('=')[1];
};
