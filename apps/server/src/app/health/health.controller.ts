import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private healthService: HealthService
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.healthService.pingCheck('database')]);
  }
}
