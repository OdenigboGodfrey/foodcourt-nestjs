import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('foodcourt API Doc')
    .setDescription('The official API foodcourt Documentation')
    .setVersion('1.0')
    .addTag('foodcourt')
    .addBearerAuth({
      name: 'Authorization',
      type: 'http',
      bearerFormat: 'JWT',
      scheme: 'Bearer',
      in: 'header',
      description: `JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.`,
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors({
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  await app.listen(3000);
}
bootstrap();
