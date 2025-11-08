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
    
    const avgDistance = recent.length > 0
      ? recent.reduce((sum, data) => sum + data.distancia_cm, 0) / recent.length
      : 0;

    return {
      total_readings: total,
      recent_readings_last_hour: recent.length,
      average_distance_cm: avgDistance.toFixed(2),
    };
  }
}

