import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Requerant } from './entities/requerant.entity';
import { CreateRequerantDto } from './dto/create-requerant.dto';
import { UpdateRequerantDto } from './dto/update-requerant.dto';

@Injectable()
export class RequerantService {
  constructor(
    @InjectRepository(Requerant)
    private readonly requerantRepository: Repository<Requerant>,
  ) {}

  async findOrCreate(createRequerantDto: CreateRequerantDto): Promise<Requerant> {
    // Recherche d'un requérant existant par nom, prénom, adresse et téléphone
    const existing = await this.requerantRepository.findOne({
      where: {
        nom: createRequerantDto.nom,
        prenom: createRequerantDto.prenom,
        adresse: createRequerantDto.adresse,
        numTelephone: createRequerantDto.numTelephone
      }
    });
    if (existing) {
      return existing;
    }
    // Sinon, création
    return this.create(createRequerantDto);
  }

  async create(createRequerantDto: CreateRequerantDto): Promise<Requerant> {
    const requerant = this.requerantRepository.create(createRequerantDto);
    return await this.requerantRepository.save(requerant);
  }

  async findAll(): Promise<Requerant[]> {
    return await this.requerantRepository.find();
  }

  async findOne(id: number): Promise<Requerant> {
    const requerant = await this.requerantRepository.findOne({ where: { id } });
    if (!requerant) {
      throw new NotFoundException(`Requérant avec l'ID ${id} non trouvé`);
    }
    return requerant;
  }

  async update(id: number, updateRequerantDto: UpdateRequerantDto): Promise<Requerant> {
    const requerant = await this.findOne(id);
    Object.assign(requerant, updateRequerantDto);
    return await this.requerantRepository.save(requerant);
  }

  async remove(id: number): Promise<void> {
    const requerant = await this.findOne(id);
    await this.requerantRepository.remove(requerant);
  }

  async autocomplete(query: string): Promise<Requerant[]> {
    if (!query) {
      return this.requerantRepository.find({ take: 10, order: { nom: 'ASC' } });
    }
    return this.requerantRepository.createQueryBuilder('requerant')
      .where('LOWER(requerant.nom) LIKE :q', { q: `%${query.toLowerCase()}%` })
      .orWhere('LOWER(requerant.prenom) LIKE :q', { q: `%${query.toLowerCase()}%` })
      .orWhere('LOWER(requerant.adresse) LIKE :q', { q: `%${query.toLowerCase()}%` })
      .orWhere('requerant.numTelephone LIKE :q', { q: `%${query}%` })
      .orderBy('requerant.nom', 'ASC')
      .limit(10)
      .getMany();
  }
} 