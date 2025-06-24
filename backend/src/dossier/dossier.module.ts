import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DossierService } from './dossier.service';
import { DossierController } from './dossier.controller';
import { Dossier } from './entities/dossier.entity';
import { AuthModule } from '../auth/auth.module';
import { TitreModule } from '../titre/titre.module';
import { RequerantModule } from '../requerant/requerant.module';
import { Titre } from '../titre/entities/titre.entity';
import { Requerant } from '../requerant/entities/requerant.entity';
import { ObservationModule } from '../observation/observation.module';
import { OperationModule } from '../operation/operation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dossier, Titre, Requerant]),
    AuthModule,
    forwardRef(() => TitreModule),
    forwardRef(() => RequerantModule),
    forwardRef(() => ObservationModule),
    forwardRef(() => OperationModule)
  ],
  providers: [DossierService],
  controllers: [DossierController],
  exports: [DossierService]
})
export class DossierModule {} 