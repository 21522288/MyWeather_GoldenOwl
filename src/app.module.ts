import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { WeatherService } from './app.service';
import { WeatherController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from './weather.entity';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { Notification } from './notification.entity';
@Module({
  imports: [  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',  
    port: 5432,         
    username: 'postgres', 
    password: 'password', 
    database: 'weather_db', 
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, 
  }),
  ConfigModule.forRoot(),
  TypeOrmModule.forFeature([Weather]),
  HttpModule,
  MailerModule], 
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
