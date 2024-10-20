import { Response } from 'express';
import { format } from 'fast-csv';
import { Stream } from 'stream';

export class CsvUtils {
  static stream<T = any>(options: {
    headers: string[];
    data: T[];
    rowFormatter: (data: T, index?: number) => string[];
    httpResponse: Response;
    name: string;
  }) {
    const { headers, data, rowFormatter, httpResponse: res, name } = options;
    const csvStream = new Stream.PassThrough();
    const csvFormatter = format({
      headers,
      writeBOM: true,
    });

    csvFormatter.pipe(csvStream);
    if (data.length) {
      data.forEach((item, index) => {
        csvFormatter.write(rowFormatter(item, index));
      });
    } else {
      csvFormatter.write([]);
    }

    csvFormatter.end();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${name}.csv`);
    csvStream.pipe(res);
  }
}
