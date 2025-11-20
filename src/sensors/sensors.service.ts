import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorData, SensorDataDocument } from './schemas/sensor-data.schema';
import { CreateSensorDataDto } from './dto/create-sensor-data.dto';

@Injectable()
export class SensorsService {
  constructor(
    @InjectModel(SensorData.name)
    private sensorDataModel: Model<SensorDataDocument>,
  ) {}

  async create(createSensorDataDto: CreateSensorDataDto): Promise<SensorData> {
    const createdSensorData = new this.sensorDataModel({
      ...createSensorDataDto,
      timestamp: new Date(),
    });
    return createdSensorData.save();
  }

  async findAll(): Promise<SensorData[]> {
    return this.sensorDataModel.find().sort({ timestamp: -1 }).limit(100).exec();
  }

  async findBySensorId(sensorId: string): Promise<SensorData[]> {
    return this.sensorDataModel
      .find({ sensor_id: sensorId })
      .sort({ timestamp: -1 })
      .limit(100)
      .exec();
  }

  async findRecent(minutes: number = 60): Promise<SensorData[]> {
    const dateLimit = new Date(Date.now() - minutes * 60 * 1000);
    return this.sensorDataModel
      .find({ timestamp: { $gte: dateLimit } })
      .sort({ timestamp: -1 })
      .exec();
  }

  async getStats() {
    const total = await this.sensorDataModel.countDocuments();
    const recent = await this.findRecent(60);
    
    // Calcular promedios para diferentes tipos de sensores
    const stats: any = {
      total_readings: total,
      recent_readings_last_hour: recent.length,
    };

    // Calcular promedio de temperatura (sensor DHT22)
    const tempReadings = recent.filter(d => d.temperatura_c !== undefined && d.temperatura_c !== null);
    if (tempReadings.length > 0) {
      const avgTemp = tempReadings.reduce((sum, data) => sum + data.temperatura_c, 0) / tempReadings.length;
      stats.average_temperature_c = avgTemp.toFixed(2);
    }

    // Calcular promedio de humedad (sensor DHT22)
    const humReadings = recent.filter(d => d.humedad_pct !== undefined && d.humedad_pct !== null);
    if (humReadings.length > 0) {
      const avgHum = humReadings.reduce((sum, data) => sum + data.humedad_pct, 0) / humReadings.length;
      stats.average_humidity_pct = avgHum.toFixed(2);
    }

    // Calcular promedio de distancia (sensor de proximidad - retrocompatibilidad)
    const distReadings = recent.filter(d => d.distancia_cm !== undefined && d.distancia_cm !== null);
    if (distReadings.length > 0) {
      const avgDist = distReadings.reduce((sum, data) => sum + data.distancia_cm, 0) / distReadings.length;
      stats.average_distance_cm = avgDist.toFixed(2);
    }

    return stats;
  }
}

