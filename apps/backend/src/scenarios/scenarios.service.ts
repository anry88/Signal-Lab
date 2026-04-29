import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Prisma } from '@prisma/client';

import { MetricsService } from '../observability/metrics.service';
import { PrismaService } from '../prisma/prisma.service';
import { RunScenarioDto } from './dto/run-scenario.dto';

@Injectable()
export class ScenariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  private async sleep(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async createRun(params: {
    type: string;
    status: string;
    duration?: number;
    error?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.scenarioRun.create({
      data: {
        type: params.type,
        status: params.status,
        duration: params.duration,
        error: params.error,
        metadata: params.metadata,
      },
    });
  }

  async runScenario(dto: RunScenarioDto) {
    const startedAt = Date.now();
    const baseMetadata = dto.name
      ? ({ name: dto.name } as Prisma.InputJsonValue)
      : undefined;

    if (dto.type === 'slow_request') {
      const delay = 2000 + Math.floor(Math.random() * 3001);
      await this.sleep(delay);
    }

    if (dto.type === 'validation_error') {
      const duration = Date.now() - startedAt;
      const message = 'Scenario forced a validation error';
      const run = await this.createRun({
        type: dto.type,
        status: 'failed',
        duration,
        error: message,
        metadata: baseMetadata,
      });

      console.warn(
        JSON.stringify({
          level: 'warn',
          msg: message,
          scenarioType: dto.type,
          scenarioId: run.id,
          duration,
          error: message,
        }),
      );

      this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'failed' });
      this.metrics.scenarioRunDurationSeconds.observe(
        { type: dto.type },
        duration / 1000,
      );

      throw new BadRequestException(message);
    }

    if (dto.type === 'system_error') {
      const duration = Date.now() - startedAt;
      const message = 'Scenario forced an internal server error';
      const run = await this.createRun({
        type: dto.type,
        status: 'failed',
        duration,
        error: message,
        metadata: baseMetadata,
      });

      console.error(
        JSON.stringify({
          level: 'error',
          msg: message,
          scenarioType: dto.type,
          scenarioId: run.id,
          duration,
          error: message,
        }),
      );

      Sentry.captureException(new Error(message), {
        tags: {
          scenarioType: dto.type,
          scenarioId: run.id,
        },
        extra: {
          duration,
        },
      });

      this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'failed' });
      this.metrics.scenarioRunDurationSeconds.observe(
        { type: dto.type },
        duration / 1000,
      );

      throw new InternalServerErrorException(message);
    }

    if (dto.type === 'teapot') {
      const duration = Date.now() - startedAt;
      const run = await this.createRun({
        type: dto.type,
        status: 'teapot',
        duration,
        metadata: {
          ...(dto.name ? { name: dto.name } : {}),
          easter: true,
        },
      });

      console.warn(
        JSON.stringify({
          level: 'warn',
          msg: "I'm a teapot",
          scenarioType: dto.type,
          scenarioId: run.id,
          duration,
          error: "I'm a teapot",
          signal: 42,
        }),
      );

      this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'teapot' });
      this.metrics.scenarioRunDurationSeconds.observe(
        { type: dto.type },
        duration / 1000,
      );

      throw new HttpException(
        { signal: 42, message: "I'm a teapot" },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }

    const duration = Date.now() - startedAt;
    const run = await this.createRun({
      type: dto.type,
      status: 'completed',
      duration,
      metadata: baseMetadata,
    });

    console.log(
      JSON.stringify({
        level: dto.type === 'slow_request' ? 'warn' : 'info',
        msg:
          dto.type === 'slow_request'
            ? 'scenario run completed slowly'
            : 'scenario run completed',
        scenarioType: dto.type,
        scenarioId: run.id,
        duration,
        error: null,
      }),
    );

    this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'completed' });
    this.metrics.scenarioRunDurationSeconds.observe(
      { type: dto.type },
      duration / 1000,
    );

    return {
      id: run.id,
      status: run.status,
      duration: run.duration ?? duration,
    };
  }

  async getLatestRuns(limit = 20) {
    const take = Math.min(Math.max(limit, 1), 100);
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      select: {
        id: true,
        type: true,
        status: true,
        duration: true,
        error: true,
        createdAt: true,
      },
    });
  }
}
