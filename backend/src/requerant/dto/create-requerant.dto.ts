import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

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
  @IsPhoneNumber('MG')
  numTelephone: string;
} 