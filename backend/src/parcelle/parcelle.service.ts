import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcelle } from './entities/parcelle.entity';
import { CreateParcelleDto } from './dto/create-parcelle.dto';
import { UpdateParcelleDto } from './dto/update-parcelle.dto';
import { DossierService } from '../dossier/dossier.service';
import { RequerantService } from '../requerant/requerant.service';
import { ObservationService } from '../observation/observation.service';
import { OperationService } from '../operation/operation.service';
import { TitreService } from '../titre/titre.service';

@Injectable()
export class ParcelleService {
  constructor(
    @InjectRepository(Parcelle)
    private parcelleRepository: Repository<Parcelle>,
    @Inject(forwardRef(() => DossierService))
    private dossierService: DossierService,
    @Inject(forwardRef(() => RequerantService))
    private requerantService: RequerantService,
    @Inject(forwardRef(() => ObservationService))
    private observationService: ObservationService,
    @Inject(forwardRef(() => OperationService))
    private operationService: OperationService,
    @Inject(forwardRef(() => TitreService))
    private titreService: TitreService,
  ) {}

  async create(createParcelleDto: CreateParcelleDto): Promise<Parcelle> {
    console.log("createParcelleDto reçu:", JSON.stringify(createParcelleDto, null, 2));

    try {
      let dossier;
      
      // Si nous avons un dossierId, récupérer le dossier existant
      if (createParcelleDto.dossierId) {
        dossier = await this.dossierService.findOne(createParcelleDto.dossierId);
        if (!dossier) {
          throw new NotFoundException(`Dossier avec l'ID ${createParcelleDto.dossierId} non trouvé`);
        }
      } else {
        // Sinon, créer un nouveau dossier avec le requérant
        if (!createParcelleDto.requerant || !createParcelleDto.dossier) {
          throw new Error("Si aucun dossierId n'est fourni, le requérant et le dossier sont requis");
        }

        // 1. Créer le requérant
        const requerant = await this.requerantService.create(createParcelleDto.requerant);
        console.log("Requérant créé:", JSON.stringify(requerant, null, 2));

        // 2. Créer le dossier avec le requérant
        const dossierData = {
          numDossier: createParcelleDto.dossier.numDossier,
          statust: createParcelleDto.dossier.statust,
          numPV: createParcelleDto.dossier.numPV || '',
          requerantId: requerant.id
        };
        console.log("Données dossier préparées:", JSON.stringify(dossierData, null, 2));
        
        dossier = await this.dossierService.create(dossierData);
        console.log("Dossier créé:", JSON.stringify(dossier, null, 2));
      }

      // 3. Créer les opérations
      console.log("Données opérations reçues:", JSON.stringify(createParcelleDto.operation, null, 2));
      if (!Array.isArray(createParcelleDto.operation)) {
        throw new Error("Les données des opérations doivent être un tableau");
      }

      const operations = await Promise.all(
        createParcelleDto.operation.map(async (op) => {
          const operationData = {
            description: op.description,
            droitOperation: op.droitOperation,
            dossierId: dossier.id
          };
          console.log("Données opération préparées:", JSON.stringify(operationData, null, 2));
          return await this.operationService.create(operationData);
        })
      );
      console.log("Opérations créées:", JSON.stringify(operations, null, 2));

      // 4. Créer les observations
      console.log("Données observations reçues:", JSON.stringify(createParcelleDto.observation, null, 2));
      if (!Array.isArray(createParcelleDto.observation)) {
        throw new Error("Les données des observations doivent être un tableau");
      }

      const observations = await Promise.all(
        createParcelleDto.observation.map(async (obs) => {
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
      console.log("Observations créées:", JSON.stringify(observations, null, 2));

      // 5. Créer la parcelle avec la relation dossier
      const parcelleData = {
        numeroParcelle: createParcelleDto.numeroParcelle,
        indiceParcelle: createParcelleDto.indiceParcelle,
        canton: createParcelleDto.canton,
        section: createParcelleDto.section,
        registre: createParcelleDto.registre,
        folio: createParcelleDto.folio,
        dossier: dossier
      };
      console.log("Données parcelle préparées:", JSON.stringify(parcelleData, null, 2));

      const parcelle = this.parcelleRepository.create(parcelleData);
      const savedParcelle = await this.parcelleRepository.save(parcelle);
      console.log("Parcelle créée:", JSON.stringify(savedParcelle, null, 2));

      // 6. Retourner la parcelle avec toutes ses relations
      const finalParcelle = await this.findOne(savedParcelle.id);
      console.log("Parcelle finale avec relations:", JSON.stringify(finalParcelle, null, 2));
      return finalParcelle;

    } catch (error) {
      console.error("Erreur lors de la création de la parcelle:", error);
      throw error;
    }
  }

  async findAll(): Promise<Parcelle[]> {
    return await this.parcelleRepository.find({
      relations: ['dossier', 'dossier.requerant', 'dossier.operations', 'dossier.observations', 'dossier.observations.operation'],
      order: {
        numeroParcelle: 'ASC',
        dateCreation: 'DESC'
      }
    });
  }

  async searchByNumero(numeroParcelle: string): Promise<Parcelle[]> {
    const parcelles = await this.parcelleRepository.find({
      where: { numeroParcelle },
      relations: ['dossier', 'dossier.requerant', 'dossier.operations', 'dossier.observations', 'dossier.observations.operation']
    });
    return parcelles;
  }

  async findOne(id: number): Promise<Parcelle> {
    const parcelle = await this.parcelleRepository.findOne({
      where: { id },
      relations: ['dossier', 'dossier.requerant', 'dossier.operations', 'dossier.observations', 'dossier.observations.operation']
    });
    if (!parcelle) {
      throw new NotFoundException(`Parcelle avec l'ID ${id} non trouvée`);
    }
    return parcelle;
  }

  async findByNumero(numeroParcelle: string): Promise<Parcelle> {
    const parcelle = await this.parcelleRepository.findOne({
      where: { numeroParcelle },
      relations: ['dossier', 'dossier.requerant', 'dossier.operations', 'dossier.observations', 'dossier.observations.operation']
    });
    if (!parcelle) {
      throw new NotFoundException(`Parcelle avec le numéro ${numeroParcelle} non trouvée`);
    }
    return parcelle;
  }

  async update(id: number, updateParcelleDto: UpdateParcelleDto): Promise<Parcelle> {
    const parcelle = await this.findOne(id);

    // Si le numéro de parcelle est modifié, vérifier s'il existe déjà
    if (updateParcelleDto.numeroParcelle && updateParcelleDto.numeroParcelle !== parcelle.numeroParcelle) {
      const existingParcelle = await this.parcelleRepository.findOne({
        where: { numeroParcelle: updateParcelleDto.numeroParcelle }
      });

      if (existingParcelle) {
        throw new ConflictException(`Une parcelle avec le numéro ${updateParcelleDto.numeroParcelle} existe déjà`);
      }
    }

    Object.assign(parcelle, updateParcelleDto);
    return await this.parcelleRepository.save(parcelle);
  }

  async remove(id: number): Promise<void> {
    const parcelle = await this.findOne(id);
    await this.parcelleRepository.remove(parcelle);
  }

  async autocompleteField(field: 'canton' | 'section' | 'registre' | 'folio'): Promise<string[]> {
    const results = await this.parcelleRepository
      .createQueryBuilder('parcelle')
      .select(`DISTINCT parcelle.${field}`, field)
      .where(`parcelle.${field} IS NOT NULL AND parcelle.${field} != ''`)
      .orderBy(`parcelle.${field}`, 'ASC')
      .getRawMany();
    return results.map((row: any) => row[field]);
  }
} 