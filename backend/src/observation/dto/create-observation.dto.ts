import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateObservationDto {
  @ApiProperty({ description: 'Description de l\'observation' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID de l\'opération associée' })
  @IsNotEmpty()
  @IsNumber()
  operationId: number;

  @ApiProperty({ description: 'ID du dossier associé' })
  @IsNotEmpty()
  @IsNumber()
  dossierId: number;

  @ApiProperty({ description: 'Date de satisfaction de l\'observation', required: false, nullable: true })
  @IsOptional()
  @Transform(({ value }) => value === null ? null : new Date(value))
  @Type(() => Date)
  SatisfaitDate: Date | null;

  @ApiProperty({ description: 'Statut de l\'observation (1 = satisfait, 0 = non satisfait)', required: false })
  @IsOptional()
  @IsNumber()
  status?: number;
} 