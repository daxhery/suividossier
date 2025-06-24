import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Nom de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email de l\'utilisateur' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mot de passe de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: UserRole.USER, 
    description: 'Rôle de l\'utilisateur',
    enum: UserRole,
    default: UserRole.USER
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
} 