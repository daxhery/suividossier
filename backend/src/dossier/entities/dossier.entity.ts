import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Titre } from '../../titre/entities/titre.entity';
import { Requerant } from '../../requerant/entities/requerant.entity';
import { Operation } from '../../operation/entities/operation.entity';
import { Observation } from '../../observation/entities/observation.entity';
import { Parcelle } from '../../parcelle/entities/parcelle.entity';

@Entity('dossiers')
export class Dossier {
  @ApiProperty({ description: 'Identifiant unique du dossier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Numéro du dossier (Format: 000/T/000/C)' })
  @Column({ unique: true })
  numDossier: string;

  @ApiProperty({ description: 'Requérant associé au dossier', type: () => Requerant })
  @ManyToOne(() => Requerant, { eager: true })
  requerant: Requerant;

  @ApiProperty({ description: 'Statut du dossier' })
  @Column()
  statust: string;

  @ApiProperty({ description: 'Numéro de procès-verbal', required: false })
  @Column({ nullable: true })
  numPV: string;

  @ApiProperty({ description: 'Opérations associées au dossier', type: () => [Operation] })
  @OneToMany(() => Operation, operation => operation.dossier)
  operations: Operation[];

  @ApiProperty({ description: 'Observations associées au dossier', type: () => [Observation] })
  @OneToMany(() => Observation, observation => observation.dossier)
  observations: Observation[];

  @ApiProperty({ description: 'Parcelles associées au dossier', type: () => [Parcelle] })
  @OneToMany(() => Parcelle, parcelle => parcelle.dossier)
  parcelles: Parcelle[];

  @ApiProperty({ description: 'Titres associés au dossier', type: () => [Titre] })
  @OneToMany(() => Titre, titre => titre.dossier)
  titres: Titre[];

  @ApiProperty({ description: 'Date de création du dossier' })
  @CreateDateColumn()
  dateCreation: Date;

  @ApiProperty({ description: 'Date de dernière modification du dossier' })
  @UpdateDateColumn()
  dateModif: Date;
} 