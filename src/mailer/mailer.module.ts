import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../notification.entity';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports:[ScheduleModule.forRoot(),ConfigModule,HttpModule,TypeOrmModule.forFeature([Notification]),],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
