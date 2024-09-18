import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  date: string;

  @Column('decimal')
  temp: number;

  @Column('decimal')
  humidity: number;

  @Column('decimal')
  windSpeed: number;

  @Column()
  icon: string;

  @Column()
  condition: string;

  @Column()
  userIp: string; 
}
