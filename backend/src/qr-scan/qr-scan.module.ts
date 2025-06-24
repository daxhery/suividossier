import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrScanController } from './qr-scan.controller';
import { QrScanService } from './qr-scan.service';
import { QrScan } from './entities/qr-scan.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QrScan]),
    AuthModule, // Pour utiliser le JwtAuthGuard
  ],
  controllers: [QrScanController],
  providers: [QrScanService],
  exports: [QrScanService],
})
export class QrScanModule {} 