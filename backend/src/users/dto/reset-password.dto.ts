import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Nouveau mot de passe de l\'utilisateur',
    minLength: 6,
    example: 'nouveauMotDePasse123'
  })
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  newPassword: string;
} 