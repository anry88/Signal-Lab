import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  readonly scenarioRunsTotal = new Counter({
    name: 'scenario_runs_total',
    help: 'Total number of scenario runs by type and status',
    labelNames: ['type', 'status'] as const,
    registers: [this.registry],
  });

  readonly scenarioRunDurationSeconds = new Histogram({
    name: 'scenario_run_duration_seconds',
    help: 'Scenario run duration in seconds by type',
    labelNames: ['type'] as const,
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 3, 5, 8],
    registers: [this.registry],
  });

  readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests by method, path and status code',
    labelNames: ['method', 'path', 'status_code'] as const,
    registers: [this.registry],
  });

  constructor() {
    collectDefaultMetrics({ register: this.registry });
  }

  async getMetrics() {
    return this.registry.metrics();
  }
}
