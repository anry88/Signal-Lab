import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ObservabilityModule } from './observability/observability.module';
import { ScenariosModule } from './scenarios/scenarios.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [HealthModule, ScenariosModule, ObservabilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
