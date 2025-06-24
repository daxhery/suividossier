import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OperationService } from './operation.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { Operation } from './entities/operation.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('operations')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('operations')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle opération' })
  @ApiResponse({ status: 201, description: 'L\'opération a été créée avec succès.', type: Operation })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 404, description: 'Dossier ou titre non trouvé.' })
  create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationService.create(createOperationDto);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Créer plusieurs opérations' })
  @ApiResponse({ status: 201, description: 'Les opérations ont été créées avec succès.', type: [Operation] })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 404, description: 'Dossier ou titre non trouvé.' })
  createMany(@Body() createOperationDtos: CreateOperationDto[]) {
    return this.operationService.createMany(createOperationDtos);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les opérations' })
  @ApiResponse({ status: 200, description: 'Liste des opérations récupérée avec succès.', type: [Operation] })
  findAll() {
    return this.operationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une opération par son ID' })
  @ApiResponse({ status: 200, description: 'L\'opération a été trouvée.', type: Operation })
  @ApiResponse({ status: 404, description: 'Opération non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.operationService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une opération' })
  @ApiResponse({ status: 200, description: 'L\'opération a été mise à jour avec succès.', type: Operation })
  @ApiResponse({ status: 404, description: 'Opération, dossier ou titre non trouvé.' })
  update(@Param('id') id: string, @Body() updateOperationDto: UpdateOperationDto) {
    return this.operationService.update(+id, updateOperationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une opération' })
  @ApiResponse({ status: 200, description: 'L\'opération a été supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Opération non trouvée.' })
  remove(@Param('id') id: string) {
    return this.operationService.remove(+id);
  }
} 