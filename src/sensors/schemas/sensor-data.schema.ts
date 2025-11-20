import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SensorDataDocument = SensorData & Document;

@Schema({ timestamps: true })
export class SensorData {
  @Prop({ required: true })
  sensor_id: string;

  // Campos para sensor DHT22 (temperatura y humedad)
  @Prop({ required: false })
  temperatura_c?: number;

  @Prop({ required: false })
  humedad_pct?: number;

  // Campo para sensor de proximidad (retrocompatibilidad)
  @Prop({ required: false })
  distancia_cm?: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);

