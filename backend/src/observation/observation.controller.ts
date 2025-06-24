import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ObservationService } from './observation.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { Observation } from './entities/observation.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('observations')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('observations')
export class ObservationController {
  constructor(private readonly observationService: ObservationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle observation' })
  @ApiResponse({ status: 201, description: 'L\'observation a été créée avec succès.', type: Observation })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 404, description: 'Opération ou pièce non trouvée.' })
  create(@Body() createObservationDto: CreateObservationDto) {
    return this.observationService.create(createObservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les observations' })
  @ApiResponse({ status: 200, description: 'Liste des observations récupérée avec succès.', type: [Observation] })
  findAll() {
    return this.observationService.findAll().then(observations =>
      observations.map(obs => ({
        id: obs.id,
        description: obs.description,
        status: obs.status,
        operationId: obs.operation?.id || 1,
        dossierId: obs.dossier?.id,
      }))
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une observation par son ID' })
  @ApiResponse({ status: 200, description: 'L\'observation a été trouvée.', type: Observation })
  @ApiResponse({ status: 404, description: 'Observation non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.observationService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une observation' })
  @ApiResponse({ status: 200, description: 'L\'observation a été mise à jour avec succès.', type: Observation })
  @ApiResponse({ status: 404, description: 'Observation, opération ou pièce non trouvée.' })
  update(@Param('id') id: string, @Body() updateObservationDto: UpdateObservationDto) {
    return this.observationService.update(+id, updateObservationDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une observation' })
  @ApiResponse({ status: 200, description: 'Le statut de l\'observation a été mis à jour avec succès.', type: Observation })
  @ApiResponse({ status: 404, description: 'Observation non trouvée.' })
  updateStatus(@Param('id') id: string) {
    return this.observationService.updateStatus(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une observation' })
  @ApiResponse({ status: 200, description: 'L\'observation a été supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Observation non trouvée.' })
  remove(@Param('id') id: string) {
    return this.observationService.remove(+id);
  }

  @Get('operation/:id')
  @ApiOperation({ summary: 'Récupérer les observations par opération' })
  @ApiResponse({ status: 200, description: 'Liste des observations récupérée avec succès.', type: [Observation] })
  @ApiResponse({ status: 404, description: 'Opération non trouvée.' })
  getObservationsByOperationId(@Param('id') id: string) {
    return this.observationService.getObservationsByOperationId(+id);
  }
} 