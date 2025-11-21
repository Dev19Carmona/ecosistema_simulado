import { Controller, Get, Post, Body } from '@nestjs/common';
import { SensorsService } from '../sensors/sensors.service';

/**
 * Controlador para exponer datos a Grafana
 * Compatible con SimpleJSON datasource format
 * Permite a Grafana consultar datos sin plugins de pago
 */
@Controller('grafana')
export class GrafanaController {
  constructor(private readonly sensorsService: SensorsService) {}

  /**
   * Health check endpoint
   * GET /grafana/
   */
  @Get('/')
  health() {
    return 'OK';
  }

  /**
   * Search endpoint - Lista de métricas disponibles
   * POST /grafana/search
   */
  @Post('/search')
  search() {
    return [
      { text: 'temperatura_c', value: 'temperatura_c' },
      { text: 'humedad_pct', value: 'humedad_pct' },
      { text: 'distancia_cm', value: 'distancia_cm' },
    ];
  }

  /**
   * Query endpoint - Obtiene datos de series temporales
   * POST /grafana/query
   * 
   * Body esperado:
   * {
   *   "range": { "from": "2024-01-01T00:00:00.000Z", "to": "2024-01-02T00:00:00.000Z" },
   *   "targets": [{ "target": "temperatura_c", "type": "timeserie" }]
   * }
   */
  @Post('/query')
  async query(@Body() body: any) {
    try {
      const targets = body.targets || [];
      const range = body.range || {};
      
      // Si no hay rango, usar últimos 60 minutos
      const from = range.from ? new Date(range.from) : new Date(Date.now() - 60 * 60 * 1000);
      const to = range.to ? new Date(range.to) : new Date();

      // Obtener datos recientes
      const allData = await this.sensorsService.findRecent(60);

      // Filtrar por rango de fechas
      const filteredData = allData.filter(d => {
        const timestamp = new Date(d.timestamp);
        return timestamp >= from && timestamp <= to;
      });

      // Formatear respuesta para cada target
      const results = targets.map(target => {
        const metric = target.target;
        let datapoints: [number, number][] = [];

        if (metric === 'temperatura_c') {
          datapoints = filteredData
            .filter(d => d.temperatura_c !== undefined && d.temperatura_c !== null)
            .map(d => [d.temperatura_c!, new Date(d.timestamp).getTime()]);
        } else if (metric === 'humedad_pct') {
          datapoints = filteredData
            .filter(d => d.humedad_pct !== undefined && d.humedad_pct !== null)
            .map(d => [d.humedad_pct!, new Date(d.timestamp).getTime()]);
        } else if (metric === 'distancia_cm') {
          datapoints = filteredData
            .filter(d => d.distancia_cm !== undefined && d.distancia_cm !== null)
            .map(d => [d.distancia_cm!, new Date(d.timestamp).getTime()]);
        }

        return {
          target: metric,
          datapoints: datapoints,
        };
      });

      return results;
    } catch (error) {
      console.error('Error en /grafana/query:', error);
      return [];
    }
  }

  /**
   * Annotations endpoint (opcional)
   * POST /grafana/annotations
   */
  @Post('/annotations')
  annotations() {
    return [];
  }

  /**
   * Tag keys endpoint (opcional)
   * POST /grafana/tag-keys
   */
  @Post('/tag-keys')
  tagKeys() {
    return [
      { type: 'string', text: 'sensor_id' },
    ];
  }

  /**
   * Tag values endpoint (opcional)
   * POST /grafana/tag-values
   */
  @Post('/tag-values')
  async tagValues(@Body() body: any) {
    const key = body.key;
    
    if (key === 'sensor_id') {
      const data = await this.sensorsService.findRecent(60);
      const sensorIds = [...new Set(data.map(d => d.sensor_id))];
      return sensorIds.map(id => ({ text: id }));
    }
    
    return [];
  }

  /**
   * Endpoint adicional: Datos en formato JSON simple
   * GET /grafana/data
   * Útil para testear y para otros tipos de visualización
   */
  @Get('/data')
  async getData() {
    const data = await this.sensorsService.findRecent(60);
    return {
      success: true,
      count: data.length,
      data: data.map(d => ({
        timestamp: d.timestamp,
        sensor_id: d.sensor_id,
        temperatura_c: d.temperatura_c,
        humedad_pct: d.humedad_pct,
        distancia_cm: d.distancia_cm,
      })),
    };
  }

  /**
   * Endpoint de estadísticas para Grafana
   * GET /grafana/stats
   */
  @Get('/stats')
  async getStats() {
    return await this.sensorsService.getStats();
  }
}

