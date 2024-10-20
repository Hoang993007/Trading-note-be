// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as httpContext from 'express-http-context';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shares/filters';
import { LoggerService } from './shares/utils/utils-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new AllExceptionsFilter(LoggerService.get('HTTP')));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(httpContext.middleware);
  app.enableCors();
  app.setGlobalPrefix(configService.get('app.prefixUrl'));
  app.enableVersioning({ type: VersioningType.URI });

  await _setupSwagger(app);
  const appPort = configService.get('app.port');
  await app.listen(appPort, () => {
    console.log(
      `[${configService.get(
        'app.name',
      )}] running on http://${'127.0.0.1'}:${appPort}`,
    );
    console.log(
      `[Swagger] http://${'127.0.0.1'}:${appPort}${configService.get(
        'app.swagger.path',
      )}`,
    );
    console.log(
      `[Static file serve] http://${'127.0.0.1'}:${appPort}${configService.get(
        'app.publicServeRoot',
      )}/`,
    );
  });
}

async function _setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);
  const options = new DocumentBuilder()
    .setTitle(configService.get('app.swagger.title'))
    .setDescription(configService.get('app.swagger.description'))
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  try {
    const outputSwaggerFile = `${process.cwd()}/output-specs/${configService.get(
      'app.name',
    )}.json`;
    fs.writeFileSync(outputSwaggerFile, JSON.stringify(document, null, 2), {
      encoding: 'utf8',
    });
  } catch (e) {
    console.warn(`Could not write swagger docs to file: ${e}`);
  }

  SwaggerModule.setup(configService.get('app.swagger.path'), app, document, {
    customSiteTitle: configService.get('app.swagger.customSiteTitle'),

    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

bootstrap();
