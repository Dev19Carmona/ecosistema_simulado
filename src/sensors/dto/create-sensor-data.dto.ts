import { IsString, IsNumber, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';

export class CreateSensorDataDto {
  @IsString()
  @IsNotEmpty()
  sensor_id: string;

  // Campos para sensor DHT22 (temperatura y humedad)
  @IsNumber()
  @IsOptional()
  @Min(-40)  // DHT22 mide desde -40°C
  @Max(80)   // DHT22 mide hasta 80°C
  temperatura_c?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)    // Humedad mínima 0%
  @Max(100)  // Humedad máxima 100%
  humedad_pct?: number;

  // Campo para sensor de proximidad (retrocompatibilidad)
  @IsNumber()
  @IsOptional()
  @Min(0)
  distancia_cm?: number;
}

