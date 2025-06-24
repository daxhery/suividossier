import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Dossier } from '../../dossier/entities/dossier.entity';
import { Operation } from '../../operation/entities/operation.entity';
import { Observation } from '../../observation/entities/observation.entity';

@Entity('titres')
export class Titre {
  @ApiProperty({ description: 'Identifiant unique du titre' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Numéro du titre' })
  @Column()
  numeroTitre: string;

  @ApiProperty({ description: 'Indice du titre' })
  @Column()
  indiceTitre: string;

  @ManyToOne(() => Dossier, dossier => dossier.titres, { eager: true })
  @ApiProperty({ description: 'Dossier associé au titre', type: () => Dossier })
  dossier: Dossier;

/*   @ApiProperty({ description: 'Opérations associées au titre', type: () => [Operation] })
  @OneToMany(() => Operation, operation => operation.titre)
  operations: Operation[];

  @ApiProperty({ description: 'Observations associées au titre', type: () => [Observation] })
  @OneToMany(() => Observation, observation => observation.titre)
  observations: Observation[];*/

  @ApiProperty({ description: 'Date de création du titre' })
  @CreateDateColumn()
  dateCreation: Date;

  @ApiProperty({ description: 'Date de dernière modification du titre' })
  @UpdateDateColumn()
  dateModif: Date;
} 