import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const scenarioTypes = [
  'success',
  'validation_error',
  'system_error',
  'slow_request',
  'teapot',
] as const;

export type ScenarioType = (typeof scenarioTypes)[number];

export class RunScenarioDto {
  @ApiProperty({
    description: 'Scenario type identifier (e.g. success, system_error).',
    example: 'success',
    enum: scenarioTypes,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(scenarioTypes)
  type!: ScenarioType;

  @ApiPropertyOptional({
    description: 'Optional display name for this run.',
    example: 'demo run',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
