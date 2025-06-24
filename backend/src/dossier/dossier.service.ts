import { Injectable, NotFoundException, Inject, forwardRef, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dossier } from './entities/dossier.entity';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { Titre } from '../titre/entities/titre.entity';
import { Requerant } from '../requerant/entities/requerant.entity';
import { TitreService } from '../titre/titre.service';
import { RequerantService } from '../requerant/requerant.service';

@Injectable()
export class DossierService {
  constructor(
    @InjectRepository(Dossier)
    private readonly dossierRepository: Repository<Dossier>,
    @Inject(forwardRef(() => TitreService))
    private readonly titreService: TitreService,
    @Inject(forwardRef(() => RequerantService))
    private readonly requerantService: RequerantService,
  ) {}

  async create(createDossierDto: CreateDossierDto): Promise<Dossier> {
    const requerant = await this.requerantService.findOne(createDossierDto.requerantId);
    if (!requerant) {
      throw new NotFoundException(`Requérant avec l'ID ${createDossierDto.requerantId} non trouvé`);
    }

    const dossier = this.dossierRepository.create({
      ...createDossierDto,
      requerant,
    });

    return await this.dossierRepository.save(dossier);
  }

  async findAll(): Promise<Dossier[]> {
    return await this.dossierRepository.find({
      relations: [
        'requerant',
        'operations',
        'observations',
        'observations.operation',
        'parcelles',
        'titres'
      ]
    });
  }

  async findOne(id: number): Promise<Dossier> {
    const dossier = await this.dossierRepository.findOne({
      where: { id },
      relations: [
        'requerant',
        'operations',
        'observations',
        'observations.operation',
        'parcelles',
        'titres'
      ]
    });
    if (!dossier) {
      throw new NotFoundException(`Dossier avec l'ID ${id} non trouvé`);
    }
    return dossier;
  }

  async update(id: number, updateDossierDto: UpdateDossierDto): Promise<Dossier> {
    const dossier = await this.findOne(id);

    if (updateDossierDto.requerantId) {
      const requerant = await this.requerantService.findOne(updateDossierDto.requerantId);
      if (!requerant) {
        throw new NotFoundException(`Requérant avec l'ID ${updateDossierDto.requerantId} non trouvé`);
      }
      dossier.requerant = requerant;
    }

    Object.assign(dossier, updateDossierDto);
    return await this.dossierRepository.save(dossier);
  }

  async remove(id: number): Promise<void> {
    const dossier = await this.findOne(id);
    await this.dossierRepository.remove(dossier);
  }

  async getLastDossierId() {
    try {
      const lastDossier = await this.dossierRepository
        .createQueryBuilder('dossier')
        .orderBy('dossier.id', 'DESC')
        .getOne();

      return {
        lastId: lastDossier ? lastDossier.id : 0
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la récupération du dernier ID de dossier',
        { cause: error }
      );
    }
  }

  async findOneByNumPV(numPV: string): Promise<Dossier> {
    const dossier = await this.dossierRepository.findOne({
      where: { numPV },
      relations: ['requerant', 'operations', 'observations', 'parcelles', 'titres']
    });
    if (!dossier) {
      throw new NotFoundException(`Dossier avec le numéro de procès-verbal ${numPV} non trouvé`);
    }
    return dossier;
  }
} 