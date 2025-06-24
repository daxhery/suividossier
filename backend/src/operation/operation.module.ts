import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationService } from './operation.service';
import { OperationController } from './operation.controller';
import { Operation } from './entities/operation.entity';
import { Observation } from '../observation/entities/observation.entity';
import { AuthModule } from '../auth/auth.module';
import { DossierModule } from '../dossier/dossier.module';
import { TitreModule } from '../titre/titre.module';
import { ObservationModule } from '../observation/observation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operation, Observation]),
    AuthModule,
    forwardRef(() => DossierModule),
    forwardRef(() => TitreModule),
    forwardRef(() => ObservationModule)
  ],
  providers: [OperationService],
  controllers: [OperationController],
  exports: [OperationService]
})
export class OperationModule {} 