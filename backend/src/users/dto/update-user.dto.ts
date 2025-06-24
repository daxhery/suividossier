import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../auth/enums/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({ 
    description: 'Nom de l\'utilisateur', 
    example: 'John Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    description: 'Email de l\'utilisateur', 
    example: 'user@example.com',
    required: false
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ 
    description: 'Rôle de l\'utilisateur', 
    enum: UserRole,
    example: UserRole.USER,
    required: false
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
} 