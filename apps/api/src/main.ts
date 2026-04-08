import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HocuspocusGateway } from './infrastructure/hocuspocus/hocuspocus.gateway';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.init();

  const httpServer: import('http').Server = app
    .getHttpServer();
  const hocuspocusGateway = app.get(HocuspocusGateway);
  hocuspocusGateway.attachUpgradeHandler(httpServer);

  const PORT = process.env.PORT ?? 8080;
  await app.listen(PORT);

  console.log(`✅ OmniNote API is running on port ${PORT}`);
}

bootstrap();
