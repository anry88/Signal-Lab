import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RunScenarioDto } from './dto/run-scenario.dto';
import {
  ScenarioRunHistoryItemDto,
  ScenarioRunResultDto,
} from './dto/scenario-response.dto';
import { ScenariosService } from './scenarios.service';

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @ApiOperation({ summary: 'Run a scenario' })
  @ApiResponse({
    status: 200,
    description: 'Scenario completed',
    type: ScenarioRunResultDto,
  })
  @ApiResponse({ status: 400, description: 'validation_error scenario' })
  @ApiResponse({ status: 418, description: 'teapot scenario bonus' })
  @ApiResponse({ status: 500, description: 'system_error scenario' })
  @Post('run')
  async runScenario(@Body() body: RunScenarioDto) {
    return this.scenariosService.runScenario(body);
  }

  @ApiOperation({ summary: 'Get latest scenario runs' })
  @ApiResponse({
    status: 200,
    description: 'Latest scenario runs',
    type: ScenarioRunHistoryItemDto,
    isArray: true,
  })
  @Get('runs')
  async getLatestRuns(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : 20;
    return this.scenariosService.getLatestRuns(
      Number.isFinite(parsed) ? parsed : 20,
    );
  }
}
