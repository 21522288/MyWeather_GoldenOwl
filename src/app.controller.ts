import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WeatherService } from './app.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/forecast')
  getforecastWeather(@Query('city') city: string, @Query('days') days: string, @Query('userIp') userIp: string) {
    const numDays = parseInt(days, 10) || 1; 
    return this.weatherService.getforecastWeather(city, numDays, userIp);
  }
  @Get('/current')
  getcurrentWeather(@Query('city') city: string, @Query('userIp') userIp: string){
    return this.weatherService.getcurrentWeather(city, userIp);
  }
  @Post('save')
  async saveWeather(
    @Body() body: { city: string; temp: number; humidity: number; windSpeed: number; userIp: string; condition: string; icon: string; date: string;},
  ) {
    const { city, temp, humidity, windSpeed, userIp, condition, icon, date} = body;
    return await this.weatherService.saveWeatherData(city, temp, humidity, windSpeed, userIp, condition, icon, date);
  }

  @Get('history')
  async getWeatherHistory(@Query('userIp') userIp: string) {
    return await this.weatherService.getWeatherByIp(userIp);
  }
}