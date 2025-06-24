import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../auth/enums/user-role.enum';

export class UserDto {
  @ApiProperty({ description: 'Identifiant unique de l\'utilisateur', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Email de l\'utilisateur', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Nom de l\'utilisateur', example: 'John Doe' })
  name: string;

  @ApiProperty({ 
    description: 'Rôle de l\'utilisateur', 
    enum: UserRole,
    example: UserRole.USER 
  })
  role: UserRole;

  @ApiProperty({ description: 'Date de création du compte', example: '2023-04-15T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour', example: '2023-04-15T10:00:00Z' })
  updatedAt: Date;
} 