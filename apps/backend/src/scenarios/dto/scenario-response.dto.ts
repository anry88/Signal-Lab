import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScenarioRunResultDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'completed' })
  status!: string;

  @ApiProperty({ example: 182 })
  duration!: number;
}

export class ScenarioRunHistoryItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional({ nullable: true })
  duration!: number | null;

  @ApiPropertyOptional({ nullable: true })
  error!: string | null;

  @ApiProperty()
  createdAt!: Date;
}
