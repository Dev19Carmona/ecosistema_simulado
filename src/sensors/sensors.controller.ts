import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SimulatorService } from './simulator.service';
import { CreateSensorDataDto } from './dto/create-sensor-data.dto';

@Controller('sensors')
export class SensorsController {
  constructor(
    private readonly sensorsService: SensorsService,
    private readonly simulatorService: SimulatorService,
  ) {}

  @Post('data')
  async createSensorData(@Body() createSensorDataDto: CreateSensorDataDto) {
    const data = await this.sensorsService.create(createSensorDataDto);
    return {
      success: true,
      message: 'Datos del sensor recibidos correctamente',
      data,
    };
  }

  @Get('data')
  async getAllSensorData() {
    const data = await this.sensorsService.findAll();
    return {
      success: true,
      count: data.length,
      data,
    };
  }

  @Get('data/:sensorId')
  async getSensorDataById(@Param('sensorId') sensorId: string) {
    const data = await this.sensorsService.findBySensorId(sensorId);
    return {
      success: true,
      sensor_id: sensorId,
      count: data.length,
      data,
    };
  }

  @Get('data/recent/:minutes')
  async getRecentData(@Param('minutes') minutes: number) {
    const data = await this.sensorsService.findRecent(minutes);
    return {
      success: true,
      minutes,
      count: data.length,
      data,
    };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.sensorsService.getStats();
    return {
      success: true,
      stats,
    };
  }

  @Post('simulator/start')
  async startSimulator() {
    const result = this.simulatorService.start();
    return {
      ...result,
      status: this.simulatorService.getStatus(),
    };
  }

  @Post('simulator/stop')
  async stopSimulator() {
    const result = this.simulatorService.stop();
    return {
      ...result,
      status: this.simulatorService.getStatus(),
    };
  }

  @Get('simulator/status')
  async getSimulatorStatus() {
    return {
      success: true,
      status: this.simulatorService.getStatus(),
    };
  }
}
