import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; 
import { AxiosResponse } from 'axios';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weather } from './weather.entity';

@Injectable()
export class WeatherService {
  private readonly apiKey = '6d8500ffcc5e48b1963114731241609';
  private readonly baseUrl = 'http://api.weatherapi.com/v1';

  constructor(private readonly httpService: HttpService,
    @InjectRepository(Weather)
    private weatherRepository: Repository<Weather>,
  ) {}

  async getforecastWeather(city: string, days: number, userIp: string): Promise<Observable<AxiosResponse<any>>> {
    const url = `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${city}&days=${days}`;
    const filter_data = this.httpService.get(url).pipe(
      map(response => {
        const data = response.data;
        return data.forecast.forecastday.slice(1).map(day => ({
          date : day.date,
          temp : day.day.avgtemp_c,
          icon : day.day.condition.icon,
          humidity : day.day.avghumidity,
          windSpeed : day.day.maxwind_kph,
        }));
      }),
    );
    
    const data = await firstValueFrom(filter_data);
    for(let i = 0; i < data.length; i++){
      await this.saveWeatherData(city,data[i].temp,data[i].humidity,data[i].windSpeed,userIp,'null',data[i].icon,data[i].date)
    }
    return filter_data;
  }
 
  async getcurrentWeather(city: string, userIp: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${city}`;
      const response: AxiosResponse = await this.httpService.get(url).toPromise();

      const data = response.data;
      const filter_data = {
        temp : data.current.temp_c,
        condition : data.current.condition.text,
        icon : data.current.condition.icon,
        humidity : data.current.humidity,
        windSpeed : data.current.wind_kph,
      }
      await this.deleteWeatherData(userIp);
      this.saveWeatherData(city,filter_data.temp,filter_data.humidity,filter_data.windSpeed,userIp,filter_data.condition,filter_data.icon,'today')
      return filter_data;
    } catch (error) {
      console.log("error current weather")
    }
  }
  async deleteWeatherData(userIp:string){
    await this.weatherRepository.delete({ userIp });
  }

  async saveWeatherData(
    city: string,
    temperature: number,
    humidity: number,
    windSpeed: number,
    userIp: string, 
    condition: string,
    icon: string,
    date: string
  ) {
    const weather = new Weather();
    weather.city = city;
    weather.date = date; 
    weather.temp = temperature;
    weather.humidity = humidity;
    weather.windSpeed = windSpeed;
    weather.icon = icon;
    weather.condition = condition;
    weather.userIp = userIp;

    await this.weatherRepository.save(weather);
  }


  async getWeatherByIp(userIp: string): Promise<Weather[]> {
    const history = await this.weatherRepository.find({ where: { userIp } });
    return history;
  }
}