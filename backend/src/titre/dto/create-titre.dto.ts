import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

export class CreateRequerantDto {
  @ApiProperty({ description: 'Nom du requérant' })
  @IsNotEmpty()
  @IsString()
  nom: string;

  @ApiProperty({ description: 'Prénom du requérant' })
  @IsNotEmpty()
  @IsString()
  prenom: string;

  @ApiProperty({ description: 'Adresse du requérant' })
  @IsNotEmpty()
  @IsString()
  adresse: string;

  @ApiProperty({ description: 'Numéro de téléphone du requérant' })
  @IsNotEmpty()
  @IsString()
  numTelephone: string;
}

export class CreateDossierDto {
  @ApiProperty({ description: 'Numéro du dossier (Format: 000/T/000/C)' })
  @IsNotEmpty()
  @IsString()
  numDossier: string;

  @ApiProperty({ description: 'Statut du dossier' })
  @IsNotEmpty()
  @IsString()
  statust: string;

  @ApiProperty({ description: 'Numéro de procès-verbal', required: false })
  @IsOptional()
  @IsString()
  numPV?: string;
}

export class CreateObservationDto {
  @ApiProperty({ description: 'Description de l\'observation' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Date de satisfaction de l\'observation', required: false, nullable: true })
  @IsOptional()
  @Transform(({ value }) => value === null ? null : new Date(value))
  @Type(() => Date)
  SatisfaitDate?: Date | null;

  @ApiProperty({ description: 'ID de l\'opération associée', required: false })
  @IsOptional()
  @IsNumber()
  operationId?: number;

  @ApiProperty({ description: 'ID du dossier associé', required: false })
  @IsOptional()
  @IsNumber()
  dossierId?: number;

  @ApiProperty({ description: 'Droit d\'opération (en Ar)', required: false })
  @IsOptional()
  @IsNumber()
  droitOperation?: number;
}

export class CreateOperationDto {
  @ApiProperty({ description: 'Droit d\'opération (en Ar)' })
  @IsNotEmpty()
  @IsNumber()
  droitOperation: number;

  @ApiProperty({ description: 'Description de l\'opération' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateTitreDto {
  @ApiProperty({ description: 'Numéro du titre' })
  @IsNotEmpty()
  @IsString()
  numeroTitre: string;

  @ApiProperty({ description: 'Indice du titre' })
  @IsNotEmpty()
  @IsString()
  indiceTitre: string;

  @ApiProperty({ description: 'ID du dossier', required: false })
  @IsOptional()
  @IsNumber()
  dossierId?: number;

  @ApiProperty({ description: 'Informations du requérant', type: CreateRequerantDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRequerantDto)
  requerant?: CreateRequerantDto;

  @ApiProperty({ description: 'Informations du dossier', type: CreateDossierDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDossierDto)
  dossier?: CreateDossierDto;

  @ApiProperty({ description: 'Informations de l\'observation', type: CreateObservationDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateObservationDto)
  observation: CreateObservationDto;

  @ApiProperty({ description: 'Informations de l\'opération', type: CreateOperationDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateOperationDto)
  operation: CreateOperationDto;
} 