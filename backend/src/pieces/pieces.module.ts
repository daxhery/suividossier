import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PiecesService } from './pieces.service';
import { PiecesController } from './pieces.controller';
import { Pieces } from './entities/pieces.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pieces]),
    AuthModule
  ],
  providers: [PiecesService],
  controllers: [PiecesController],
  exports: [PiecesService]
})
export class PiecesModule {} 