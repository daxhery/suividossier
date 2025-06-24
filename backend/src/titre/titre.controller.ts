import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TitreService } from './titre.service';
import { CreateTitreDto } from './dto/create-titre.dto';
import { UpdateTitreDto } from './dto/update-titre.dto';
import { Titre } from './entities/titre.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('titres')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('titres')
export class TitreController {
  constructor(private readonly titreService: TitreService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau titre' })
  @ApiResponse({ status: 201, description: 'Le titre a été créé avec succès.', type: Titre })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() createTitreDto: CreateTitreDto) {
    return this.titreService.create(createTitreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les titres' })
  @ApiResponse({ status: 200, description: 'Liste des titres récupérée avec succès.', type: [Titre] })
  findAll() {
    return this.titreService.findAll();
  }

  @Get('search/:numeroTitre')
  @ApiOperation({ summary: 'Rechercher un titre par son numéro' })
  @ApiResponse({ status: 200, description: 'Le titre a été trouvé.', type: [Titre] })
  @ApiResponse({ status: 404, description: 'Titre non trouvé.' })
  searchByNumero(@Param('numeroTitre') numeroTitre: string) {
    return this.titreService.searchByNumero(numeroTitre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un titre par son ID' })
  @ApiResponse({ status: 200, description: 'Le titre a été trouvé.', type: Titre })
  @ApiResponse({ status: 404, description: 'Titre non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.titreService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un titre' })
  @ApiResponse({ status: 200, description: 'Le titre a été mis à jour avec succès.', type: Titre })
  @ApiResponse({ status: 404, description: 'Titre non trouvé.' })
  update(@Param('id') id: string, @Body() updateTitreDto: UpdateTitreDto) {
    return this.titreService.update(+id, updateTitreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un titre' })
  @ApiResponse({ status: 200, description: 'Le titre a été supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Titre non trouvé.' })
  remove(@Param('id') id: string) {
    return this.titreService.remove(+id);
  }
} 