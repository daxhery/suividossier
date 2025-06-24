import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOperationDto {
  @ApiProperty({ description: 'Droit d\'opération (en Ar)' })
  @IsNotEmpty()
  @IsNumber()
  droitOperation: number;

  @ApiProperty({ description: 'Description de l\'opération' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID du dossier associé' })
  @IsNotEmpty()
  @IsNumber()
  dossierId: number;
} 