import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelleService } from './parcelle.service';
import { ParcelleController } from './parcelle.controller';
import { Parcelle } from './entities/parcelle.entity';
import { AuthModule } from '../auth/auth.module';
import { DossierModule } from '../dossier/dossier.module';
import { RequerantModule } from '../requerant/requerant.module';
import { ObservationModule } from '../observation/observation.module';
import { OperationModule } from '../operation/operation.module';
import { TitreModule } from '../titre/titre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parcelle]),
    AuthModule,
    forwardRef(() => DossierModule),
    forwardRef(() => RequerantModule),
    forwardRef(() => ObservationModule),
    forwardRef(() => OperationModule),
    forwardRef(() => TitreModule)
  ],
  providers: [ParcelleService],
  controllers: [ParcelleController],
  exports: [ParcelleService]
})
export class ParcelleModule {} 