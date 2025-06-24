import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('pieces')
export class Pieces {
  @ApiProperty({ description: 'Identifiant unique de la pièce' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nom de la pièce' })
  @Column()
  nomPieces: string;

  @ApiProperty({ description: 'Chemin vers le fichier de la pièce' })
  @Column()
  fichier: string;

  @ApiProperty({ description: 'Date de création de la pièce' })
  @CreateDateColumn()
  dateCreation: Date;

  @ApiProperty({ description: 'Date de dernière modification de la pièce' })
  @UpdateDateColumn()
  dateModif: Date;
} 