import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ParcelleService } from './parcelle.service';
import { CreateParcelleDto } from './dto/create-parcelle.dto';
import { UpdateParcelleDto } from './dto/update-parcelle.dto';
import { Parcelle } from './entities/parcelle.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('parcelles')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('parcelles')
export class ParcelleController {
  constructor(private readonly parcelleService: ParcelleService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle parcelle' })
  @ApiResponse({ status: 201, description: 'La parcelle a été créée avec succès.', type: Parcelle })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 404, description: 'Dossier non trouvé.' })
  @ApiResponse({ status: 409, description: 'Une parcelle avec ce numéro existe déjà.' })
  create(@Body() createParcelleDto: CreateParcelleDto) {
    return this.parcelleService.create(createParcelleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les parcelles' })
  @ApiResponse({ status: 200, description: 'Liste des parcelles récupérée avec succès.', type: [Parcelle] })
  findAll() {
    return this.parcelleService.findAll();
  }

  @Get('search/:numeroParcelle')
  @ApiOperation({ summary: 'Rechercher une parcelle par son numéro' })
  @ApiResponse({ status: 200, description: 'La parcelle a été trouvée.', type: [Parcelle] })
  @ApiResponse({ status: 404, description: 'Parcelle non trouvée.' })
  searchByNumero(@Param('numeroParcelle') numeroParcelle: string) {
    return this.parcelleService.searchByNumero(numeroParcelle);
  }

  @Get('numero/:numero')
  @ApiOperation({ summary: 'Récupérer une parcelle par son numéro' })
  @ApiResponse({ status: 200, description: 'La parcelle a été trouvée.', type: Parcelle })
  @ApiResponse({ status: 404, description: 'Parcelle non trouvée.' })
  findByNumero(@Param('numero') numero: string) {
    return this.parcelleService.findByNumero(numero);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une parcelle par son ID' })
  @ApiResponse({ status: 200, description: 'La parcelle a été trouvée.', type: Parcelle })
  @ApiResponse({ status: 404, description: 'Parcelle non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.parcelleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une parcelle' })
  @ApiResponse({ status: 200, description: 'La parcelle a été mise à jour avec succès.', type: Parcelle })
  @ApiResponse({ status: 404, description: 'Parcelle ou dossier non trouvé.' })
  @ApiResponse({ status: 409, description: 'Une parcelle avec ce numéro existe déjà.' })
  update(@Param('id') id: string, @Body() updateParcelleDto: UpdateParcelleDto) {
    return this.parcelleService.update(+id, updateParcelleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une parcelle' })
  @ApiResponse({ status: 200, description: 'La parcelle a été supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Parcelle non trouvée.' })
  remove(@Param('id') id: string) {
    return this.parcelleService.remove(+id);
  }

  @Get('autocomplete/cantons')
  @ApiOperation({ summary: 'Autocomplétion des cantons' })
  @ApiResponse({ status: 200, description: 'Liste des cantons distincts', type: [String] })
  async autocompleteCantons() {
    return (await this.parcelleService.autocompleteField('canton'));
  }

  @Get('autocomplete/sections')
  @ApiOperation({ summary: 'Autocomplétion des sections' })
  @ApiResponse({ status: 200, description: 'Liste des sections distinctes', type: [String] })
  async autocompleteSections() {
    return (await this.parcelleService.autocompleteField('section'));
  }

  @Get('autocomplete/registres')
  @ApiOperation({ summary: 'Autocomplétion des registres' })
  @ApiResponse({ status: 200, description: 'Liste des registres distincts', type: [String] })
  async autocompleteRegistres() {
    return (await this.parcelleService.autocompleteField('registre'));
  }

  @Get('autocomplete/folios')
  @ApiOperation({ summary: 'Autocomplétion des folios' })
  @ApiResponse({ status: 200, description: 'Liste des folios distincts', type: [String] })
  async autocompleteFolios() {
    return (await this.parcelleService.autocompleteField('folio'));
  }
} 