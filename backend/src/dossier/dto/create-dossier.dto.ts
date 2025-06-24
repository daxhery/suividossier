import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDossierDto {
  @ApiProperty({ description: 'Numéro du dossier (Format: 000/T/000/C)' })
  @IsNotEmpty()
  @IsString()
  numDossier: string;

  @ApiProperty({ description: 'ID du requérant associé' })
  @IsNotEmpty()
  @IsNumber()
  requerantId: number;

  @ApiProperty({ description: 'Statut du dossier' })
  @IsNotEmpty()
  @IsString()
  statust: string;

  @ApiProperty({ description: 'Numéro de procès-verbal', required: false })
  @IsOptional()
  @IsString()
  numPV?: string;
} 