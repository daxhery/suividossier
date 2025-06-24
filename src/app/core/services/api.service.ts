import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { 
  Dossier, 
  Requerant, 
  Operation, 
  Observation, 
  Parcelle, 
  Titre,
  CreateDossierDto,
  CreateRequerantDto,
  CreateOperationDto,
  CreateObservationDto,
  CreateParcelleDto,
  CreateTitreDto
} from '../models/dossier.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Dossiers
  getDossiers(): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(`${this.API_URL}/dossiers`);
  }

  getDossier(id: number): Observable<Dossier> {
    return this.http.get<Dossier>(`${this.API_URL}/dossiers/${id}`);
  }

  createDossier(dossier: CreateDossierDto): Observable<Dossier> {
    return this.http.post<Dossier>(`${this.API_URL}/dossiers`, dossier);
  }

  updateDossier(id: number, dossier: Partial<CreateDossierDto>): Observable<Dossier> {
    return this.http.patch<Dossier>(`${this.API_URL}/dossiers/${id}`, dossier);
  }

  deleteDossier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/dossiers/${id}`);
  }

  getLastDossierId(): Observable<{ lastId: number }> {
    return this.http.get<{ lastId: number }>(`${this.API_URL}/dossiers/last-id`);
  }

  // Requérants
  getRequerants(): Observable<Requerant[]> {
    return this.http.get<Requerant[]>(`${this.API_URL}/requerants`);
  }

  getRequerant(id: number): Observable<Requerant> {
    return this.http.get<Requerant>(`${this.API_URL}/requerants/${id}`);
  }

  createRequerant(requerant: CreateRequerantDto): Observable<Requerant> {
    return this.http.post<Requerant>(`${this.API_URL}/requerants`, requerant);
  }

  updateRequerant(id: number, requerant: Partial<CreateRequerantDto>): Observable<Requerant> {
    return this.http.patch<Requerant>(`${this.API_URL}/requerants/${id}`, requerant);
  }

  deleteRequerant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/requerants/${id}`);
  }

  autocompleteRequerants(query: string): Observable<Requerant[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Requerant[]>(`${this.API_URL}/requerants/autocomplete`, { params });
  }

  // Opérations
  getOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${this.API_URL}/operations`);
  }

  getOperation(id: number): Observable<Operation> {
    return this.http.get<Operation>(`${this.API_URL}/operations/${id}`);
  }

  createOperation(operation: CreateOperationDto): Observable<Operation> {
    return this.http.post<Operation>(`${this.API_URL}/operations`, operation);
  }

  createOperations(operations: CreateOperationDto[]): Observable<Operation[]> {
    return this.http.post<Operation[]>(`${this.API_URL}/operations/batch`, operations);
  }

  updateOperation(id: number, operation: Partial<CreateOperationDto>): Observable<Operation> {
    return this.http.patch<Operation>(`${this.API_URL}/operations/${id}`, operation);
  }

  deleteOperation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/operations/${id}`);
  }

  // Observations
  getObservations(): Observable<Observation[]> {
    return this.http.get<Observation[]>(`${this.API_URL}/observations`);
  }

  getObservation(id: number): Observable<Observation> {
    return this.http.get<Observation>(`${this.API_URL}/observations/${id}`);
  }

  createObservation(observation: CreateObservationDto): Observable<Observation> {
    return this.http.post<Observation>(`${this.API_URL}/observations`, observation);
  }

  updateObservation(id: number, observation: Partial<CreateObservationDto>): Observable<Observation> {
    return this.http.patch<Observation>(`${this.API_URL}/observations/${id}`, observation);
  }

  updateObservationStatus(id: number): Observable<Observation> {
    return this.http.patch<Observation>(`${this.API_URL}/observations/${id}/status`, {});
  }

  deleteObservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/observations/${id}`);
  }

  getObservationsByOperation(operationId: number): Observable<Observation[]> {
    return this.http.get<Observation[]>(`${this.API_URL}/observations/operation/${operationId}`);
  }

  // Parcelles
  getParcelles(): Observable<Parcelle[]> {
    return this.http.get<Parcelle[]>(`${this.API_URL}/parcelles`);
  }

  getParcelle(id: number): Observable<Parcelle> {
    return this.http.get<Parcelle>(`${this.API_URL}/parcelles/${id}`);
  }

  searchParcelles(numeroParcelle: string): Observable<Parcelle[]> {
    return this.http.get<Parcelle[]>(`${this.API_URL}/parcelles/search/${numeroParcelle}`);
  }

  getParcelleByNumero(numero: string): Observable<Parcelle> {
    return this.http.get<Parcelle>(`${this.API_URL}/parcelles/numero/${numero}`);
  }

  createParcelle(parcelle: CreateParcelleDto): Observable<Parcelle> {
    return this.http.post<Parcelle>(`${this.API_URL}/parcelles`, parcelle);
  }

  updateParcelle(id: number, parcelle: Partial<CreateParcelleDto>): Observable<Parcelle> {
    return this.http.patch<Parcelle>(`${this.API_URL}/parcelles/${id}`, parcelle);
  }

  deleteParcelle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/parcelles/${id}`);
  }

  // Autocomplétion pour parcelles
  autocompleteCantons(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/parcelles/autocomplete/cantons`);
  }

  autocompleteSections(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/parcelles/autocomplete/sections`);
  }

  autocompleteRegistres(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/parcelles/autocomplete/registres`);
  }

  autocompleteFolios(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/parcelles/autocomplete/folios`);
  }

  // Titres
  getTitres(): Observable<Titre[]> {
    return this.http.get<Titre[]>(`${this.API_URL}/titres`);
  }

  getTitre(id: number): Observable<Titre> {
    return this.http.get<Titre>(`${this.API_URL}/titres/${id}`);
  }

  searchTitres(numeroTitre: string): Observable<Titre[]> {
    return this.http.get<Titre[]>(`${this.API_URL}/titres/search/${numeroTitre}`);
  }

  createTitre(titre: CreateTitreDto): Observable<Titre> {
    return this.http.post<Titre>(`${this.API_URL}/titres`, titre);
  }

  updateTitre(id: number, titre: Partial<CreateTitreDto>): Observable<Titre> {
    return this.http.patch<Titre>(`${this.API_URL}/titres/${id}`, titre);
  }

  deleteTitre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/titres/${id}`);
  }
}