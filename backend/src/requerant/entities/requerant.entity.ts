import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('requerants')
export class Requerant {
  @ApiProperty({ description: 'Identifiant unique du requérant' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nom du requérant' })
  @Column()
  nom: string;

  @ApiProperty({ description: 'Prénom du requérant' })
  @Column()
  prenom: string;

  @ApiProperty({ description: 'Adresse du requérant' })
  @Column()
  adresse: string;

  @ApiProperty({ description: 'Numéro de téléphone du requérant' })
  @Column()
  numTelephone: string;

  @ApiProperty({ description: 'Date de création du requérant' })
  @CreateDateColumn()
  dateCreation: Date;

  @ApiProperty({ description: 'Date de dernière modification du requérant' })
  @UpdateDateColumn()
  dateModif: Date;
} 