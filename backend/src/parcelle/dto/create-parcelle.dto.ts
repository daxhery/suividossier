import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

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
  @ApiProperty({ description: 'Droit d\'opération (en Ar)' })
  @IsNotEmpty()
  @IsNumber()
  droitOperation: number;
  
  @ApiProperty({ description: 'Description de l\'observation' })
  @IsNotEmpty()
  @IsString()
  description: string;
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

export class CreateParcelleDto {
  @ApiProperty({ 
    description: 'Numéro de la parcelle (Format: 000/C)',
    example: '001/C'
  })
  @IsNotEmpty()
  @IsString()
  numeroParcelle: string;

  @ApiProperty({ 
    description: 'Indice de la parcelle',
    example: 'A'
  })
  @IsNotEmpty()
  @IsString()
  indiceParcelle: string;

  @ApiProperty({ 
    description: 'Canton',
    example: 'Canton Nord'
  })
  @IsNotEmpty()
  @IsString()
  canton: string;

  @ApiProperty({ 
    description: 'Section',
    example: 'Section A'
  })
  @IsNotEmpty()
  @IsString()
  section: string;

  @ApiProperty({ 
    description: 'Registre',
    example: 'Registre 2023'
  })
  @IsNotEmpty()
  @IsString()
  registre: string;

  @ApiProperty({ 
    description: 'Folio',
    example: '123'
  })
  @IsNotEmpty()
  @IsString()
  folio: string;

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

  @ApiProperty({ 
    description: 'Liste des observations',
    type: [CreateObservationDto],
    isArray: true
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateObservationDto)
  observation: CreateObservationDto[];

  @ApiProperty({ 
    description: 'Liste des opérations',
    type: [CreateOperationDto],
    isArray: true
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOperationDto)
  operation: CreateOperationDto[];
} 