import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequerantService } from './requerant.service';
import { RequerantController } from './requerant.controller';
import { Requerant } from './entities/requerant.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Requerant]),
    AuthModule
  ],
  providers: [RequerantService],
  controllers: [RequerantController],
  exports: [RequerantService]
})
export class RequerantModule {} 