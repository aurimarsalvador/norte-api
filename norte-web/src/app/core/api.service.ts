import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Assessment,
  AuthResponse,
  CareerArea,
  Feedback,
  InterestLevel,
  LoginRequest,
  MicroExperience,
  MicroExperienceAnswer,
  MicroExperienceAnswerRequest,
  MyPath,
  ProfessionDetail,
  ProfessionSummary,
  Profile,
  Question,
  Recommendation,
  RegisterRequest,
} from './models/api.models';

/**
 * Unico ponto de contato com a norte-api.
 *
 * <p>Concentrar as rotas aqui significa que nenhum componente monta URL a mao e que o
 * prefixo /api/v1 aparece uma vez so no frontend inteiro.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, request);
  }

  listQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions`);
  }

  startOrResumeAssessment(): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments`, {});
  }

  getAssessment(assessmentId: number): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.baseUrl}/assessments/${assessmentId}`);
  }

  answerQuestion(
    assessmentId: number,
    questionId: number,
    answerOptionId: number,
  ): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments/${assessmentId}/answers`, {
      questionId,
      answerOptionId,
    });
  }

  completeAssessment(assessmentId: number): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.baseUrl}/assessments/${assessmentId}/complete`, {});
  }

  getProfile(assessmentId: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/assessments/${assessmentId}/profile`);
  }

  getRecommendations(assessmentId: number, limit = 10): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(
      `${this.baseUrl}/assessments/${assessmentId}/recommendations`,
      { params: new HttpParams().set('limit', limit) },
    );
  }

  listCareerAreas(): Observable<CareerArea[]> {
    return this.http.get<CareerArea[]>(`${this.baseUrl}/career-areas`);
  }

  listProfessions(areaCode?: string | null, assessmentId?: number | null): Observable<ProfessionSummary[]> {
    let params = new HttpParams();
    if (areaCode) {
      params = params.set('areaCode', areaCode);
    }
    if (assessmentId) {
      params = params.set('assessmentId', assessmentId);
    }
    return this.http.get<ProfessionSummary[]>(`${this.baseUrl}/professions`, { params });
  }

  getProfession(professionId: number, assessmentId?: number | null): Observable<ProfessionDetail> {
    let params = new HttpParams();
    if (assessmentId) {
      params = params.set('assessmentId', assessmentId);
    }
    return this.http.get<ProfessionDetail>(`${this.baseUrl}/professions/${professionId}`, { params });
  }

  saveFeedback(professionId: number, interestLevel: InterestLevel): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.baseUrl}/professions/${professionId}/feedback`, {
      interestLevel,
    });
  }

  getMicroExperience(professionId: number): Observable<MicroExperience> {
    return this.http.get<MicroExperience>(
      `${this.baseUrl}/professions/${professionId}/micro-experience`,
    );
  }

  respondMicroExperience(
    microExperienceId: number,
    request: MicroExperienceAnswerRequest,
  ): Observable<MicroExperienceAnswer> {
    return this.http.post<MicroExperienceAnswer>(
      `${this.baseUrl}/micro-experiences/${microExperienceId}/respond`,
      request,
    );
  }

  getMyPath(): Observable<MyPath> {
    return this.http.get<MyPath>(`${this.baseUrl}/students/me/my-path`);
  }
}
