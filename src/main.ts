import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://wim-tech.com/'

    ],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Wim app API')
    .setDescription('The Wim app API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('providers')
    .addTag('credits')
    .addTag('payments')
    .addTag('notifications')
    .addTag('service-categories')
    .addTag('service-requests')
    .addTag('services')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
