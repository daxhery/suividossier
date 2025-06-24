import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationService } from './observation.service';
import { ObservationController } from './observation.controller';
import { Observation } from './entities/observation.entity';
import { AuthModule } from '../auth/auth.module';
import { OperationModule } from '../operation/operation.module';
import { DossierModule } from '../dossier/dossier.module';
import { TitreModule } from '../titre/titre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Observation]),
    AuthModule,
    forwardRef(() => OperationModule),
    forwardRef(() => DossierModule),
    forwardRef(() => TitreModule)
  ],
  providers: [ObservationService],
  controllers: [ObservationController],
  exports: [ObservationService]
})
export class ObservationModule {} 