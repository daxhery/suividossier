export interface Dossier {
  id: number;
  numDossier: string;
  statust: string;
  numPV?: string;
  requerant: Requerant;
  operations: Operation[];
  observations: Observation[];
  parcelles: Parcelle[];
  titres: Titre[];
  dateCreation: Date;
  dateModif: Date;
}

export interface Requerant {
  id: number;
  nom: string;
  prenom: string;
  adresse: string;
  numTelephone: string;
  dateCreation: Date;
  dateModif: Date;
}

export interface Operation {
  id: number;
  droitOperation: number;
  description: string;
  dossier: Dossier;
  observations: Observation[];
  dateCreation: Date;
  dateModif: Date;
}

export interface Observation {
  id: number;
  description: string;
  status: number;
  SatisfaitDate: Date | null;
  operation: Operation;
  dossier: Dossier;
  dateCreation: Date;
  dateModif: Date;
}

export interface Parcelle {
  id: number;
  numeroParcelle: string;
  indiceParcelle: string;
  canton: string;
  section: string;
  registre: string;
  folio: string;
  dossier: Dossier;
  dateCreation: Date;
  dateModif: Date;
}

export interface Titre {
  id: number;
  numeroTitre: string;
  indiceTitre: string;
  dossier: Dossier;
  dateCreation: Date;
  dateModif: Date;
}

// DTOs pour la création
export interface CreateDossierDto {
  numDossier: string;
  requerantId: number;
  statust: string;
  numPV?: string;
}

export interface CreateRequerantDto {
  nom: string;
  prenom: string;
  adresse: string;
  numTelephone: string;
}

export interface CreateOperationDto {
  droitOperation: number;
  description: string;
  dossierId: number;
}

export interface CreateObservationDto {
  description: string;
  operationId: number;
  dossierId: number;
  SatisfaitDate?: Date | null;
  status?: number;
}

export interface CreateParcelleDto {
  numeroParcelle: string;
  indiceParcelle: string;
  canton: string;
  section: string;
  registre: string;
  folio: string;
  dossierId?: number;
  requerant?: CreateRequerantDto;
  dossier?: CreateDossierDto;
  observation: CreateObservationDto[];
  operation: CreateOperationDto[];
}

export interface CreateTitreDto {
  numeroTitre: string;
  indiceTitre: string;
  dossierId?: number;
  requerant?: CreateRequerantDto;
  dossier?: CreateDossierDto;
  observation: CreateObservationDto;
  operation: CreateOperationDto;
}