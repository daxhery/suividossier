import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Operation } from '../../operation/entities/operation.entity';
import { Dossier } from '../../dossier/entities/dossier.entity';
import { Titre } from '../../titre/entities/titre.entity';

@Entity('observations')
export class Observation {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Identifiant unique de l\'observation' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Description de l\'observation' })
  description: string;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Statut de l\'observation (1 = satisfait, 0 = non satisfait)' })
  status: number;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Date de satisfaction de l\'observation', nullable: true })
  SatisfaitDate: Date | null;

  @ManyToOne(() => Operation, operation => operation.observations)
  @ApiProperty({ description: 'Opération associée à l\'observation', type: () => Operation })
  operation: Operation;

  @ManyToOne(() => Dossier, dossier => dossier.observations)
  @ApiProperty({ description: 'Dossier associé à l\'observation', type: () => Dossier })
  dossier: Dossier;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date de création de l\'observation' })
  dateCreation: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Date de dernière modification de l\'observation' })
  dateModif: Date;
} 