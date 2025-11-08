import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateSensorDataDto {
  @IsString()
  @IsNotEmpty()
  sensor_id: string;

  @IsNumber()
  @IsPositive()
  distancia_cm: number;
}

