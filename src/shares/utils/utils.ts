import * as util from 'util';
import * as _ from 'lodash';

export function safeToString(json: any): string {
  if (isEmpty(json)) {
    return null;
  }

  try {
    return JSON.stringify(json);
  } catch (error) {
    console.log(error);
    return util.inspect(json);
  }
}

export function nowInSeconds() {
  return ~~(Date.now() / 1000);
}

export function nowInMs() {
  return ~~Date.now();
}

export function isEmpty(obj: any): boolean {
  if (obj == null || obj == undefined) return true;

  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function convertToArray(obj: any): any[] {
  if (isEmpty(obj)) return undefined;

  if (Array.isArray(obj)) return obj;

  return [obj];
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getEnumKeys<T extends string | number>(
  e: Record<string, T>,
): string[] {
  return _.difference(
    _.keys(e),
    _.map(_.filter(_.values(e), _.isNumber), _.toString),
  );
}

export function getEnumValues<T extends string | number>(
  e: Record<string, T>,
): T[] {
  return _.values(_.pick(e, getEnumKeys(e)));
}
