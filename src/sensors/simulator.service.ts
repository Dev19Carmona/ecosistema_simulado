import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SensorsService } from './sensors.service';

@Injectable()
export class SimulatorService implements OnModuleDestroy {
  private readonly logger = new Logger(SimulatorService.name);
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private sensorId = 'proximidad_01';
  private intervalMs = 5000;
  private minDistance = 5.0;
  private maxDistance = 200.0;

  constructor(
    private readonly sensorsService: SensorsService,
    private readonly configService: ConfigService,
  ) {
    // Configuración desde variables de entorno
    this.sensorId = this.configService.get<string>('SIMULATOR_SENSOR_ID') || 'proximidad_01';
    this.intervalMs = parseInt(this.configService.get<string>('SIMULATOR_INTERVAL_MS') || '5000');
    this.minDistance = parseFloat(this.configService.get<string>('SIMULATOR_MIN_DISTANCE') || '5.0');
    this.maxDistance = parseFloat(this.configService.get<string>('SIMULATOR_MAX_DISTANCE') || '200.0');
  }

  /**
   * Genera una distancia aleatoria simulando un sensor real
   */
  private generateRandomDistance(): number {
    const distance = Math.random() * (this.maxDistance - this.minDistance) + this.minDistance;
    return parseFloat(distance.toFixed(2));
  }

  /**
   * Envía datos del sensor al servidor
   */
  private async sendSensorData(): Promise<void> {
    try {
      const sensorData = {
        sensor_id: this.sensorId,
        distancia_cm: this.generateRandomDistance(),
      };

      await this.sensorsService.create(sensorData);
      this.logger.log(`📡 Datos enviados: ${JSON.stringify(sensorData)}`);
    } catch (error) {
      this.logger.error(`❌ Error al enviar datos: ${error.message}`);
    }
  }

  /**
   * Inicia el simulador
   */
  start(): { success: boolean; message: string } {
    if (this.isRunning) {
      return {
        success: false,
        message: 'El simulador ya está en ejecución',
      };
    }

    this.isRunning = true;
    this.logger.log('🚀 Iniciando simulador de sensor');
    this.logger.log(`📋 Configuración: Sensor ID: ${this.sensorId}, Intervalo: ${this.intervalMs}ms`);

    // Enviar datos inmediatamente
    this.sendSensorData();

    // Enviar datos a intervalos regulares
    this.intervalId = setInterval(() => {
      this.sendSensorData();
    }, this.intervalMs);

    return {
      success: true,
      message: `Simulador iniciado. Enviando datos cada ${this.intervalMs}ms`,
    };
  }

  /**
   * Detiene el simulador
   */
  stop(): { success: boolean; message: string } {
    if (!this.isRunning) {
      return {
        success: false,
        message: 'El simulador no está en ejecución',
      };
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    this.logger.log('🛑 Simulador detenido');

    return {
      success: true,
      message: 'Simulador detenido correctamente',
    };
  }

  /**
   * Obtiene el estado del simulador
   */
  getStatus(): { isRunning: boolean; sensorId: string; intervalMs: number } {
    return {
      isRunning: this.isRunning,
      sensorId: this.sensorId,
      intervalMs: this.intervalMs,
    };
  }

  /**
   * Limpia recursos al destruir el módulo
   */
  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

