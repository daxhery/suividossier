import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Dossier } from '../../dossier/entities/dossier.entity';
import { Titre } from '../../titre/entities/titre.entity';
import { Observation } from '../../observation/entities/observation.entity';

@Entity('operations')
export class Operation {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Identifiant unique de l\'opération' })
  id: number;

  @ApiProperty({ description: 'Droit d\'opération (en Ar)' })
  @Column('float')
  droitOperation: number;

  @Column()
  @ApiProperty({ description: 'Description de l\'opération' })
  description: string;

  @ManyToOne(() => Dossier, dossier => dossier.operations)
  @ApiProperty({ description: 'Dossier associé à l\'opération', type: () => Dossier })
  dossier: Dossier;


  @OneToMany(() => Observation, observation => observation.operation)
  @ApiProperty({ description: 'Observations associées à l\'opération', type: () => [Observation] })
  observations: Observation[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Date de création de l\'opération' })
  dateCreation: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Date de dernière modification de l\'opération' })
  dateModif: Date;
} 