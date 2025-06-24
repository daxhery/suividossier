import { Controller, Get, Param, UseGuards, Delete, Put, Body, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserRole } from '../auth/enums/user-role.enum';
import { Public } from '../auth/decorators/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRoles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UserRoles(UserRole.ADMIN)
  //@Public()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des utilisateurs récupérée avec succès', 
    type: UserDto,
    isArray: true 
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UserRoles(UserRole.ADMIN)
  //@Public()
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de l\'utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur récupéré avec succès', 
    type: UserDto
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('UserRole/:UserRole')
  @UserRoles(UserRole.ADMIN)
  @Public()
  @ApiOperation({ summary: 'Récupérer les utilisateurs par rôle' })
  @ApiParam({ 
    name: 'UserRole', 
    enum: UserRole, 
    description: 'Rôle de l\'utilisateur' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateurs récupérés avec succès', 
    type: UserDto,
    isArray: true 
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  async findByUserRole(@Param('UserRole') UserRole: UserRole) {
    return this.usersService.findByRole(UserRole);
  }

  @Get('name/:name')
  @UserRoles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Récupérer les utilisateurs par nom' })
  @ApiParam({ 
    name: 'name', 
    description: 'Nom de l\'utilisateur (recherche partielle)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateurs récupérés avec succès', 
    type: UserDto,
    isArray: true 
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  async findByName(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Delete(':id')
  @UserRoles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un utilisateur par ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de l\'utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur supprimé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Utilisateur supprimé avec succès'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }

  @Put(':id')
  @UserRoles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur par ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de l\'utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur mis à jour avec succès', 
    type: UserDto
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/reset-password')
  @UserRoles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Réinitialiser le mot de passe d\'un utilisateur' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de l\'utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Mot de passe réinitialisé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Mot de passe réinitialisé avec succès'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async resetPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    await this.usersService.resetPassword(id, resetPasswordDto.newPassword);
    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
