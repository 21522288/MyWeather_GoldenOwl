import { NestFactory } from '@nestjs/core';
import { WeatherModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(WeatherModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
