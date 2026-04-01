import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HocuspocusGateway } from './infrastructure/hocuspocus/hocuspocus.gateway';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the web frontend
  app.enableCors();

  // Initialize the NestJS app (triggers OnModuleInit lifecycle hooks)
  await app.init();

  // Attach Hocuspocus WebSocket upgrade handler to the underlying HTTP server
  const httpServer: import('http').Server = app
    .getHttpServer();
  const hocuspocusGateway = app.get(HocuspocusGateway);
  hocuspocusGateway.attachUpgradeHandler(httpServer);

  const PORT = process.env.PORT ?? 8080;
  await app.listen(PORT);

  console.log(`✅ OmniNote API is running on port ${PORT}`);
}

bootstrap();
