import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PiecesService } from './pieces.service';
import { CreatePiecesDto } from './dto/create-pieces.dto';
import { UpdatePiecesDto } from './dto/update-pieces.dto';
import { Pieces } from './entities/pieces.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('pieces')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('pieces')
export class PiecesController {
  constructor(private readonly piecesService: PiecesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle pièce' })
  @ApiResponse({ status: 201, description: 'La pièce a été créée avec succès.', type: Pieces })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() createPiecesDto: CreatePiecesDto) {
    return this.piecesService.create(createPiecesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les pièces' })
  @ApiResponse({ status: 200, description: 'Liste des pièces récupérée avec succès.', type: [Pieces] })
  findAll() {
    return this.piecesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une pièce par son ID' })
  @ApiResponse({ status: 200, description: 'La pièce a été trouvée.', type: Pieces })
  @ApiResponse({ status: 404, description: 'Pièce non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.piecesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une pièce' })
  @ApiResponse({ status: 200, description: 'La pièce a été mise à jour avec succès.', type: Pieces })
  @ApiResponse({ status: 404, description: 'Pièce non trouvée.' })
  update(@Param('id') id: string, @Body() updatePiecesDto: UpdatePiecesDto) {
    return this.piecesService.update(+id, updatePiecesDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une pièce' })
  @ApiResponse({ status: 200, description: 'La pièce a été supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Pièce non trouvée.' })
  remove(@Param('id') id: string) {
    return this.piecesService.remove(+id);
  }
} 