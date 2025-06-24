import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from './entities/operation.entity';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { DossierService } from '../dossier/dossier.service';
import { TitreService } from '../titre/titre.service';
import { Titre } from '../titre/entities/titre.entity';
import { Observation } from '../observation/entities/observation.entity';

@Injectable()
export class OperationService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
    @InjectRepository(Observation)
    private observationRepository: Repository<Observation>,
    private dossierService: DossierService,
    private titreService: TitreService,
  ) {}

  async create(createOperationDto: CreateOperationDto): Promise<Operation> {
    console.log('Service - Données reçues pour création d\'opération:', JSON.stringify(createOperationDto, null, 2));

    // Vérifier si le dossier existe
    const dossier = await this.dossierService.findOne(createOperationDto.dossierId);
    if (!dossier) {
      throw new NotFoundException(`Dossier avec l'ID ${createOperationDto.dossierId} non trouvé`);
    }


    // Vérifier que la description est fournie
    if (!createOperationDto.description) {
      console.log('Erreur: Description manquante dans les données:', createOperationDto);
      throw new Error('La description de l\'opération est obligatoire');
    }

    // Créer l'opération avec les données fournies
    const operation = this.operationRepository.create({
      droitOperation: createOperationDto.droitOperation || 0,
      description: createOperationDto.description,
      dossier: dossier,
    });

    try {
      console.log('Service - Tentative de sauvegarde de l\'opération:', JSON.stringify(operation, null, 2));
      return await this.operationRepository.save(operation);
    } catch (error) {
      console.error('Service - Erreur lors de la création de l\'opération:', error);
      throw new Error('Erreur lors de la création de l\'opération: ' + error.message);
    }
  }

  // Nouvelle méthode pour créer plusieurs opérations
  async createMany(operations: CreateOperationDto[]): Promise<Operation[]> {
    console.log('Service - Données reçues pour création d\'opérations en batch:', JSON.stringify(operations, null, 2));
    const createdOperations: Operation[] = [];
    
    for (const operationDto of operations) {
      try {
        const operation = await this.create(operationDto);
        createdOperations.push(operation);
      } catch (error) {
        console.error(`Service - Erreur lors de la création de l'opération:`, error);
        // Continuer avec les autres opérations même si une échoue
      }
    }
    
    return createdOperations;
  }

  async findAll(): Promise<Operation[]> {
    return await this.operationRepository.find({
      relations: ['dossier']
    });
  }

  async findOne(id: number): Promise<Operation> {
    const operation = await this.operationRepository.findOne({
      where: { id },
      relations: ['dossier']
    });
    if (!operation) {
      throw new NotFoundException(`Opération avec l'ID ${id} non trouvée`);
    }
    return operation;
  }

  async update(id: number, updateOperationDto: UpdateOperationDto): Promise<Operation> {
    const operation = await this.findOne(id);

    // Si un nouveau dossier est spécifié, vérifier s'il existe
    if (updateOperationDto.dossierId) {
      const dossier = await this.dossierService.findOne(updateOperationDto.dossierId);
      if (!dossier) {
        throw new NotFoundException(`Dossier avec l'ID ${updateOperationDto.dossierId} non trouvé`);
      }
      operation.dossier = dossier;
    }


    if (updateOperationDto.droitOperation !== undefined) {
      operation.droitOperation = updateOperationDto.droitOperation;
    }
    if (updateOperationDto.description) {
      operation.description = updateOperationDto.description;
    }

    return await this.operationRepository.save(operation);
  }

  async remove(id: number): Promise<void> {
    const operation = await this.findOne(id);
    
    // Supprimer d'abord toutes les observations liées à cette opération
    await this.observationRepository
      .createQueryBuilder()
      .delete()
      .from(Observation)
      .where("operationId = :id", { id: operation.id })
      .execute();
    
    // Ensuite supprimer l'opération
    await this.operationRepository.remove(operation);
  }
} 