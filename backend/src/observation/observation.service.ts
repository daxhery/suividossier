import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observation } from './entities/observation.entity';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { OperationService } from '../operation/operation.service';
import { DossierService } from '../dossier/dossier.service';

@Injectable()
export class ObservationService {
  constructor(
    @InjectRepository(Observation)
    private observationRepository: Repository<Observation>,
    @Inject(forwardRef(() => OperationService))
    private operationService: OperationService,
    private dossierService: DossierService,
  ) {}

  async create(createObservationDto: CreateObservationDto): Promise<Observation> {
    // Vérifier si l'opération existe
    const operation = await this.operationService.findOne(createObservationDto.operationId);
    if (!operation) {
      throw new NotFoundException(`Opération avec l'ID ${createObservationDto.operationId} non trouvée`);
    }

    // Vérifier si le dossier existe
    const dossier = await this.dossierService.findOne(createObservationDto.dossierId);
    if (!dossier) {
      throw new NotFoundException(`Dossier avec l'ID ${createObservationDto.dossierId} non trouvé`);
    }

    const observation = this.observationRepository.create({
      description: createObservationDto.description,
      status: createObservationDto.status ?? 0, // Conserve le statut si fourni, sinon 0
      operation,
      dossier,
      SatisfaitDate: createObservationDto.SatisfaitDate || null // Gérer explicitement la valeur null
    });

    return await this.observationRepository.save(observation);
  }

  async findAll(): Promise<any[]> {
    const observations = await this.observationRepository.find({
      relations: ['operation', 'dossier']
    });
    return observations.map(obs => ({
      id: obs.id,
      description: obs.description,
      status: obs.status,
      operationId: obs.operation?.id,
      dossierId: obs.dossier?.id,
    }));
  }

  async findOne(id: number): Promise<any> {
    const obs = await this.observationRepository.findOne({
      where: { id },
      relations: ['operation', 'dossier']
    });
    if (!obs) {
      throw new NotFoundException(`Observation avec l'ID ${id} non trouvée`);
    }
    return {
      id: obs.id,
      description: obs.description,
      status: obs.status,
      operationId: obs.operation?.id,
      dossierId: obs.dossier?.id,
    };
  }

  async update(id: number, updateObservationDto: UpdateObservationDto): Promise<Observation> {
    const observation = await this.findOne(id);

    if (!updateObservationDto) {
      throw new NotFoundException('Données de mise à jour non fournies');
    }

    if (updateObservationDto.operationId !== undefined) {
      const operation = await this.operationService.findOne(updateObservationDto.operationId);
      if (!operation) {
        throw new NotFoundException(`Opération avec l'ID ${updateObservationDto.operationId} non trouvée`);
      }
      observation.operation = operation;
    }

    if (updateObservationDto.dossierId !== undefined) {
      const dossier = await this.dossierService.findOne(updateObservationDto.dossierId);
      if (!dossier) {
        throw new NotFoundException(`Dossier avec l'ID ${updateObservationDto.dossierId} non trouvé`);
      }
      observation.dossier = dossier;
    }

    if (updateObservationDto.description) {
      observation.description = updateObservationDto.description;
    }

    return await this.observationRepository.save(observation);
  }

  async updateStatus(id: number): Promise<Observation> {
    const observation = await this.observationRepository.findOne({
      where: { id },
      relations: ['operation', 'dossier']
    });

    if (!observation) {
      throw new NotFoundException(`Observation avec l'ID ${id} non trouvée`);
    }

    observation.status = 1; // Marquer comme satisfait
    observation.SatisfaitDate = new Date(); // Mettre à jour la date de satisfaction
    const savedObservation = await this.observationRepository.save(observation);

    // Vérifier si toutes les observations du dossier sont satisfaites
    const dossierId = observation.dossier.id;
    const allObservations = await this.observationRepository.find({ where: { dossier: { id: dossierId } } });
    const allSatisfied = allObservations.length > 0 && allObservations.every(obs => obs.status === 1);
    if (allSatisfied) {
      await this.dossierService.update(dossierId, { statust: 'Terminé' });
    }

    return savedObservation;
  }

  async remove(id: number): Promise<void> {
    const observation = await this.findOne(id);
    await this.observationRepository.remove(observation);
  }

  async getObservationsByOperationId(operationId: number): Promise<Observation[]> {
    return this.observationRepository.find({ where: { operation: { id: operationId } } });
  }
} 