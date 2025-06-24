import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Titre } from './entities/titre.entity';
import { CreateTitreDto } from './dto/create-titre.dto';
import { UpdateTitreDto } from './dto/update-titre.dto';
import { RequerantService } from '../requerant/requerant.service';
import { DossierService } from '../dossier/dossier.service';
import { ObservationService } from '../observation/observation.service';
import { OperationService } from '../operation/operation.service';
import { Dossier } from '../dossier/entities/dossier.entity';

@Injectable()
export class TitreService {
  constructor(
    @InjectRepository(Titre)
    private readonly titreRepository: Repository<Titre>,
    @Inject(forwardRef(() => RequerantService))
    private readonly requerantService: RequerantService,
    @Inject(forwardRef(() => DossierService))
    private readonly dossierService: DossierService,
    @Inject(forwardRef(() => ObservationService))
    private readonly observationService: ObservationService,
    @Inject(forwardRef(() => OperationService))
    private readonly operationService: OperationService,
  ) {}

  async create(createTitreDto: CreateTitreDto): Promise<Titre> {
    console.log("createTitreDto reçu:", JSON.stringify(createTitreDto, null, 2));

    let dossier: Dossier;

    // Si on a un dossierId, on récupère le dossier existant
    if (createTitreDto.dossierId) {
      dossier = await this.dossierService.findOne(createTitreDto.dossierId);
    } else {
      // Sinon, on crée un nouveau dossier
      if (!createTitreDto.requerant || !createTitreDto.dossier) {
        throw new Error("Si aucun dossierId n'est fourni, le requérant et le dossier sont requis");
      }

      // 1. Créer le requérant
      const requerant = await this.requerantService.create(createTitreDto.requerant);

      // 2. Créer le dossier avec le requérant
      dossier = await this.dossierService.create({
        ...createTitreDto.dossier,
        requerantId: requerant.id
      });
    }

    // 3. Créer les opérations
    console.log("Données opérations reçues:", JSON.stringify(createTitreDto.operation, null, 2));
    if (!Array.isArray(createTitreDto.operation)) {
      throw new Error("Les données des opérations doivent être un tableau");
    }

    const operations = await Promise.all(
      createTitreDto.operation.map(async (op) => {
        const operationData = {
          description: op.description,
          droitOperation: op.droitOperation,
          dossierId: dossier.id
        };
        console.log("Données opération préparées:", JSON.stringify(operationData, null, 2));
        return await this.operationService.create(operationData);
      })
    );

    // 4. Créer les observations
    console.log("Données observations reçues:", JSON.stringify(createTitreDto.observation, null, 2));
    if (!Array.isArray(createTitreDto.observation)) {
      throw new Error("Les données des observations doivent être un tableau");
    }

    const observations = await Promise.all(
      createTitreDto.observation.map(async (obs) => {
        const observationData = {
          description: obs.description,
          operationId: operations[0].id, // On lie à la première opération pour l'instant
          dossierId: dossier.id,
          SatisfaitDate: null as Date | null,
          droitOperation: obs.droitOperation
        };
        console.log("Données observation préparées:", JSON.stringify(observationData, null, 2));
        return await this.observationService.create(observationData);
      })
    );

    // 5. Créer le titre avec la relation dossier
    const titre = this.titreRepository.create({
      numeroTitre: createTitreDto.numeroTitre,
      indiceTitre: createTitreDto.indiceTitre,
      dossier: dossier
    });

    // 6. Sauvegarder le titre
    const savedTitre = await this.titreRepository.save(titre);

    // 7. Retourner le titre avec toutes ses relations
    return await this.findOne(savedTitre.id);
  }

  async findAll(): Promise<Titre[]> {
    return await this.titreRepository.find({
      relations: [
        'dossier',
        'dossier.requerant',
        'dossier.operations',
        'dossier.observations',
        'dossier.observations.operation'
      ],
    });
  }

  async searchByNumero(numeroTitre: string): Promise<Titre[]> {
    try {
      console.log('Recherche de titre avec numéro:', numeroTitre);
      
      const titres = await this.titreRepository.find({
        where: { numeroTitre },
        relations: [
          'dossier', 
          'dossier.requerant', 
          'dossier.operations', 
          'dossier.observations',
          'dossier.observations.operation'
        ],
      });

      console.log('Titres trouvés:', JSON.stringify(titres, null, 2));

      if (!titres || titres.length === 0) {
        return [];
      }

      // Pour chaque titre, ajouter l'operationId aux observations
      for (const titre of titres) {
        if (titre.dossier?.observations) {
          titre.dossier.observations = titre.dossier.observations.map(obs => ({
            ...obs,
            operationId: obs.operation?.id || null
          }));
        }
      }

      return titres;
    } catch (error) {
      console.error('Erreur lors de la recherche des titres:', error);
      throw new Error(`Erreur lors de la recherche des titres: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Titre> {
    const titre = await this.titreRepository.findOne({
      where: { id },
      relations: [
        'dossier',
        'dossier.requerant',
        'dossier.operations',
        'dossier.observations',
        'dossier.observations.operation'
      ],
    });
    if (!titre) {
      throw new NotFoundException(`Titre avec l'ID ${id} non trouvé`);
    }
    return titre;
  }

  async update(id: number, updateTitreDto: UpdateTitreDto): Promise<Titre> {
    const titre = await this.findOne(id);
    Object.assign(titre, updateTitreDto);
    return await this.titreRepository.save(titre);
  }

  async remove(id: number): Promise<void> {
    const titre = await this.findOne(id);
    await this.titreRepository.remove(titre);
  }
} 