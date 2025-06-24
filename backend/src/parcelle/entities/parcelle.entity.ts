import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Dossier } from '../../dossier/entities/dossier.entity';

@Entity('parcelles')
export class Parcelle {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Identifiant unique de la parcelle' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Numéro de la parcelle (Format: 000/C)' })
  numeroParcelle: string;

  @Column()
  @ApiProperty({ description: 'Indice de la parcelle' })
  indiceParcelle: string;

  @Column()
  @ApiProperty({ description: 'Canton' })
  canton: string;

  @Column()
  @ApiProperty({ description: 'Section' })
  section: string;

  @Column()
  @ApiProperty({ description: 'Registre' })
  registre: string;

  @Column()
  @ApiProperty({ description: 'Folio' })
  folio: string;

  @ManyToOne(() => Dossier, dossier => dossier.parcelles, { eager: true })
  @ApiProperty({ description: 'Dossier associé à la parcelle', type: () => Dossier })
  dossier: Dossier;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date de création de la parcelle' })
  dateCreation: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Date de dernière modification de la parcelle' })
  dateModif: Date;
} 