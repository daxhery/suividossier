import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePiecesDto {
  @ApiProperty({ description: 'Nom de la pièce' })
  @IsNotEmpty()
  @IsString()
  nomPieces: string;

  @ApiProperty({ description: 'Chemin vers le fichier de la pièce' })
  @IsNotEmpty()
  @IsString()
  fichier: string;
} 