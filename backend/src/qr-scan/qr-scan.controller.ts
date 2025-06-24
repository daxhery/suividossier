import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QrScanService } from './qr-scan.service';
import { CreateQrScanDto } from './dto/create-qr-scan.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { QrScan } from './entities/qr-scan.entity';
import { Request } from 'express';

@ApiTags('qr-scan')
@Controller('qr-scan')
@UseGuards(JwtGuard)
export class QrScanController {
  constructor(private readonly qrScanService: QrScanService) {}

  @Post('save')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enregistrer un scan de QR code' })
  @ApiResponse({ status: 201, description: 'Scan enregistré avec succès', type: QrScan })
  async save(@Body() createQrScanDto: CreateQrScanDto, @Req() request: Request): Promise<QrScan> {
    const user = request.user as any;
    return this.qrScanService.create(createQrScanDto, user?.id);
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer l\'historique des scans QR' })
  @ApiResponse({ status: 200, description: 'Liste des scans récupérée avec succès', type: [QrScan] })
  async getHistory(@Req() request: Request): Promise<QrScan[]> {
    const user = request.user as any;
    return this.qrScanService.findAll(user?.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer un scan par id' })
  @ApiResponse({ status: 200, description: 'Scan trouvé', type: QrScan })
  @ApiResponse({ status: 404, description: 'Scan non trouvé' })
  async getOne(@Param('id') id: string): Promise<QrScan> {
    return this.qrScanService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un scan QR' })
  @ApiResponse({ status: 200, description: 'Scan supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Scan non trouvé' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.qrScanService.remove(id);
  }
} 