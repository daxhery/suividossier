import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RequerantService } from './requerant.service';
import { CreateRequerantDto } from './dto/create-requerant.dto';
import { UpdateRequerantDto } from './dto/update-requerant.dto';
import { Requerant } from './entities/requerant.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('requerants')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('requerants')
export class RequerantController {
  constructor(private readonly requerantService: RequerantService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau requérant' })
  @ApiResponse({ status: 201, description: 'Le requérant a été créé avec succès.', type: Requerant })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() createRequerantDto: CreateRequerantDto) {
    return this.requerantService.create(createRequerantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les requérants' })
  @ApiResponse({ status: 200, description: 'Liste des requérants récupérée avec succès.', type: [Requerant] })
  findAll() {
    return this.requerantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un requérant par son ID' })
  @ApiResponse({ status: 200, description: 'Le requérant a été trouvé.', type: Requerant })
  @ApiResponse({ status: 404, description: 'Requérant non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.requerantService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un requérant' })
  @ApiResponse({ status: 200, description: 'Le requérant a été mis à jour avec succès.', type: Requerant })
  @ApiResponse({ status: 404, description: 'Requérant non trouvé.' })
  update(@Param('id') id: string, @Body() updateRequerantDto: UpdateRequerantDto) {
    return this.requerantService.update(+id, updateRequerantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un requérant' })
  @ApiResponse({ status: 200, description: 'Le requérant a été supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Requérant non trouvé.' })
  remove(@Param('id') id: string) {
    return this.requerantService.remove(+id);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Autocomplétion des requérants' })
  @ApiResponse({ status: 200, description: 'Liste des requérants filtrés', type: [Requerant] })
  autocomplete(@Param('query') query: string) {
    return this.requerantService.autocomplete(query);
  }
} 