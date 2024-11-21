import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import config from 'src/config';
import { FileUploadModule } from 'src/modules/file-upload/file-upload.module';
import { SharedController } from './shared.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ load: config }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const serveRoot = configService.get<string>('app.publicServeRoot');
        return [
          {
            rootPath: join(__dirname, '..', '..', '..', 'public'),
            serveRoot,
          },
        ];
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return { uri: configService.get<string>('database.mongodb.uri') };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        signOptions: {
          expiresIn: configService.getOrThrow<string>('auth.jwt.expiresIn'),
        },
        secret: configService.getOrThrow<string>('auth.jwt.secret'),
      }),
      inject: [ConfigService],
      imports: [SharedModule],
    }),
    FileUploadModule,
  ],
  controllers: [SharedController],
  providers: [],
  exports: [MongooseModule, ConfigModule, JwtModule, FileUploadModule],
})
export class SharedModule {}
