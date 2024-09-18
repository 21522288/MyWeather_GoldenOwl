import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './mail.interface';
import Mail from 'nodemailer/lib/mailer';
import { Notification } from '../notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios'; 
@Injectable()
export class MailerService {
    constructor(private readonly configService:ConfigService,
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        private readonly httpService: HttpService
    ){}
    mailTransport(){
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: 'ngothibaolinhnm2003@gmail.com', 
      pass: 'ihtfmeaaasyxiidr', 
    },
        })
        return transporter;
    }

    async sendEmail(dto: SendEmailDto){
        const {from, recipents, subject, html} = dto;
        const transport = this.mailTransport();
        const options: Mail.Options = {
            from: from ,
            to: recipents,
            subject,
            html,
        };
        try{
            const result = await transport.sendMail(options);
            return result;
        }catch(error){
            console.log(error)
        }
    }

    @Cron(CronExpression.EVERY_MINUTE) //hàm gửi email thời tiết hằng ngày
  async handleCron() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5)+":00";  
    const notifications = await this.getAllNotifications();

    notifications.forEach(async (notification) => {
      if (notification.time === currentTime) {
        const url = `http://api.weatherapi.com/v1/current.json?key=6d8500ffcc5e48b1963114731241609&q=${notification.city}`;
        const response: AxiosResponse = await this.httpService.get(url).toPromise(); 
        const data = response.data;
        const dto: SendEmailDto = {
            from:{name:"MyWeather", address:"myweather@gmail.com"},
            recipents:[{name: '', address:notification.email}],
            subject:'Notification - MyWeather - '+notification.city,
            html: `
             <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weather Notification</title>
    </head>
    <body>
      <p>Hello,</p>
      <p>In ${notification.city}, the temperature is ${data.current.temp_c}°C, the humidity is ${data.current.humidity}%, and the wind speed is ${data.current.wind_kph} km/h.</p>
      <p>Thanks,</p>
      <p>MyWeather Team</p>
    </body>
    </html>
          `
          }
        await this.sendEmail(dto);
      }
    });
  }
    async saveNotification(email: string, city: string, time: string) {
        const notification = new Notification();
        notification.email = email;
        notification.city = city;
        notification.time = time;
    
        return await this.notificationRepository.save(notification);
      }
    
      async deleteNotification(email:string){
        await this.notificationRepository.delete({email});
      }
    
      async getAllNotifications() {
        return await this.notificationRepository.find();
      }

      async isEmailExists(email: string): Promise<boolean> {
        const notification = await this.notificationRepository.findOne({ where: { email } });
        return !!notification; 
      }
}
