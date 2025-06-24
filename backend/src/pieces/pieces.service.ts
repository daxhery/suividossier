import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pieces } from './entities/pieces.entity';
import { CreatePiecesDto } from './dto/create-pieces.dto';
import { UpdatePiecesDto } from './dto/update-pieces.dto';

@Injectable()
export class PiecesService {
  constructor(
    @InjectRepository(Pieces)
    private readonly piecesRepository: Repository<Pieces>,
  ) {}

  async create(createPiecesDto: CreatePiecesDto): Promise<Pieces> {
    const pieces = this.piecesRepository.create(createPiecesDto);
    return await this.piecesRepository.save(pieces);
  }

  async findAll(): Promise<Pieces[]> {
    return await this.piecesRepository.find();
  }

  async findOne(id: number): Promise<Pieces> {
    const pieces = await this.piecesRepository.findOne({ where: { id } });
    if (!pieces) {
      throw new NotFoundException(`Pièce avec l'ID ${id} non trouvée`);
    }
    return pieces;
  }

  async update(id: number, updatePiecesDto: UpdatePiecesDto): Promise<Pieces> {
    const pieces = await this.findOne(id);
    Object.assign(pieces, updatePiecesDto);
    return await this.piecesRepository.save(pieces);
  }

  async remove(id: number): Promise<void> {
    const pieces = await this.findOne(id);
    await this.piecesRepository.remove(pieces);
  }
} 