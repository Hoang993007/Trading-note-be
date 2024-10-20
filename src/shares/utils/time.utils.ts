import * as moment from 'moment-timezone';

export class TimeUtils {
  static formatUnixTime2Ja = (
    unixTimeInSec: number,
    format = 'YYYY年MM月DD日, HH:mm:ss',
  ): string => {
    return moment(unixTimeInSec * 1000)
      .tz('Japan')
      .format(format);
  };
}
