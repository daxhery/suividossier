import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './auth/entities/user.entity';
import { UserRole } from './auth/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { Client as PgClient } from 'pg';
import { Repository } from 'typeorm';
import { RequerantModule } from './requerant/requerant.module';
import { PiecesModule } from './pieces/pieces.module';
import { ObservationModule } from './observation/observation.module';
import { TitreModule } from './titre/titre.module';
import { DossierModule } from './dossier/dossier.module';
import { OperationModule } from './operation/operation.module';
import { ParcelleModule } from './parcelle/parcelle.module';
import { InitService } from './init.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Vérifier/créer la base
        const client = new PgClient({
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          user: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: 'postgres',
        });
        try {
          await client.connect();
          const dbName = configService.get('DATABASE_NAME');
          const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
          );
          if (result.rows.length === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Base de données ${dbName} créée avec succès`);
          }
          await client.end();
        } catch (error) {
          console.error('Erreur lors de la vérification/création de la base de données:', error);
          throw error;
        }
        // Config TypeORM
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: process.env.DB_SYNC === 'true',
          logging: process.env.DB_LOGGING === 'true',
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    RequerantModule,
    PiecesModule,
    ObservationModule,
    TitreModule,
    DossierModule,
    OperationModule,
    ParcelleModule
  ],
  providers: [
    {
      provide: 'APP_INITIALIZER',
      useFactory: (userRepository: Repository<User>) => async () => {
        const adminExists = await userRepository.findOne({
          where: { role: UserRole.ADMIN }
        });
        if (!adminExists) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          const adminUser = userRepository.create({
            email: 'admin@domaine.com',
            password: hashedPassword,
            name: 'Administrateur',
            role: UserRole.ADMIN
          });
          await userRepository.save(adminUser);
          console.log('Utilisateur admin créé avec succès');
        }
      },
      inject: [getRepositoryToken(User)]
    },
    InitService
  ],
  exports: [InitService]
})
export class AppModule {
  constructor(private readonly initService: InitService) {}
}
