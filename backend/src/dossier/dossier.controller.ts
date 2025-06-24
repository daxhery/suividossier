import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DossierService } from './dossier.service';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { Dossier } from './entities/dossier.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('dossiers')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('dossiers')
export class DossierController {
  constructor(private readonly dossierService: DossierService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau dossier' })
  @ApiResponse({ status: 201, description: 'Le dossier a été créé avec succès.', type: Dossier })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 404, description: 'Titre ou requérant non trouvé.' })
  create(@Body() createDossierDto: CreateDossierDto) {
    return this.dossierService.create(createDossierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les dossiers' })
  @ApiResponse({ status: 200, description: 'Liste des dossiers récupérée avec succès.', type: [Dossier] })
  findAll() {
    return this.dossierService.findAll();
  }

  @Get('last-id')
  @ApiOperation({ summary: 'Récupérer le dernier ID de dossier' })
  @ApiResponse({ 
    status: 200, 
    description: 'Le dernier ID de dossier a été récupéré avec succès.',
    schema: {
      type: 'object',
      properties: {
        lastId: {
          type: 'number',
          description: 'Le dernier ID de dossier trouvé, ou 0 si aucun dossier n\'existe'
        }
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur lors de la récupération du dernier ID.' })
  getLastDossierId() {
    return this.dossierService.getLastDossierId();
  }

  @Get('pv/:numPV')
  @ApiOperation({ summary: 'Récupérer un dossier par son numéro de procès-verbal' })
  @ApiResponse({ status: 200, description: 'Le dossier a été trouvé.', type: Dossier })
  @ApiResponse({ status: 404, description: 'Dossier non trouvé.' })
  findOneByNumPV(@Param('numPV') numPV: string) {
    return this.dossierService.findOneByNumPV(numPV);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un dossier par son ID' })
  @ApiResponse({ status: 200, description: 'Le dossier a été trouvé.', type: Dossier })
  @ApiResponse({ status: 404, description: 'Dossier non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.dossierService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un dossier' })
  @ApiResponse({ status: 200, description: 'Le dossier a été mis à jour avec succès.', type: Dossier })
  @ApiResponse({ status: 404, description: 'Dossier, titre ou requérant non trouvé.' })
  update(@Param('id') id: string, @Body() updateDossierDto: UpdateDossierDto) {
    return this.dossierService.update(+id, updateDossierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un dossier' })
  @ApiResponse({ status: 200, description: 'Le dossier a été supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Dossier non trouvé.' })
  remove(@Param('id') id: string) {
    return this.dossierService.remove(+id);
  }
} 