import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsModule } from './sensors/sensors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URI');
        if (!mongoUri) {
          throw new Error(
            'MONGODB_URI no está definida en las variables de entorno. ' +
            'Por favor, configura MONGODB_URI en Render.com con tu connection string de MongoDB Atlas.'
          );
        }
        // Validar que la URI tenga el formato correcto
        if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
          throw new Error(
            `MONGODB_URI tiene un formato inválido. Debe comenzar con "mongodb://" o "mongodb+srv://". ` +
            `Valor recibido: ${mongoUri.substring(0, 20)}...`
          );
        }
        return {
          uri: mongoUri,
        };
      },
      inject: [ConfigService],
    }),
    SensorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
