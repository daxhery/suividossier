import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TitreService } from './titre.service';
import { TitreController } from './titre.controller';
import { Titre } from './entities/titre.entity';
import { AuthModule } from '../auth/auth.module';
import { DossierModule } from '../dossier/dossier.module';
import { OperationModule } from '../operation/operation.module';
import { ObservationModule } from '../observation/observation.module';
import { RequerantModule } from '../requerant/requerant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Titre]),
    AuthModule,
    forwardRef(() => DossierModule),
    forwardRef(() => OperationModule),
    forwardRef(() => ObservationModule),
    forwardRef(() => RequerantModule)
  ],
  providers: [TitreService],
  controllers: [TitreController],
  exports: [TitreService]
})
export class TitreModule {} 