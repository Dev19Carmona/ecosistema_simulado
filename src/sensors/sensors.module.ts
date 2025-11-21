import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { SimulatorService } from './simulator.service';
import { SensorData, SensorDataSchema } from './schemas/sensor-data.schema';
import { GrafanaController } from '../grafana/grafana.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SensorData.name, schema: SensorDataSchema },
    ]),
  ],
  controllers: [SensorsController, GrafanaController],
  providers: [SensorsService, SimulatorService],
})
export class SensorsModule {}
