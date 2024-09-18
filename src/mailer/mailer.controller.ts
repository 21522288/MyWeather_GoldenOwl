import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './mail.interface';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/send-email/verification')
  async sendEmail(@Body() body:{email:string; code:string} ){
    const {email,code} = body;
    console.log(email)
    const dto: SendEmailDto = {
      from:{name:"MyWeather", address:"myweather@gmail.com"},
      recipents:[{name: '', address:email}],
      subject:'Account Verification - MyWeather',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification</title>
      </head>
      <body>
        <p>Hello,</p>
        <p>To complete your account verification, please enter this code:</p>
        <h2>${code}</h2>
        <p>Thanks,</p>
      </body>
      </html>
    `
    }
    return this.mailerService.sendEmail(dto);
  }
  @Post('save')
  async saveNotification(
    @Body() body: { email:string; city: string; time:string},
  ) {
    const { email, city, time} = body;
    console.log('save noti'+email+city+time)
    return await this.mailerService.saveNotification(email,city,time);
  }

  @Delete(':email')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async deleteNotification(@Param('email') email: string): Promise<void> {
    await this.mailerService.deleteNotification(email);
  }

  @Get('exists/:email')
  async checkEmailExists(@Param('email') email: string): Promise<{ exists: boolean }> {
    const exists = await this.mailerService.isEmailExists(email);
    return { exists }; 
  }
}
