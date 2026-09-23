import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { AuthResponse, LoginRequest, RegisterRequest } from './models/api.models';
import { TokenStorage } from './token-storage.service';

/**
 * Sessao do estudante.
 *
 * <p>O token vive em localStorage para a jornada sobreviver a um refresh no meio do
 * questionario. A sessao em si e um signal, entao qualquer tela que dependa de estar
 * logado reage sozinha ao logout.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly storage = inject(TokenStorage);

  private readonly tokenSignal = signal(this.storage.readToken());
  private readonly studentSignal = signal(this.storage.readStudent());

  readonly student = this.studentSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.tokenSignal() !== null);

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.api.register(request).pipe(tap((response) => this.startSession(response)));
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.api.login(request).pipe(tap((response) => this.startSession(response)));
  }

  logout(): void {
    this.storage.clear();
    this.tokenSignal.set(null);
    this.studentSignal.set(null);
    void this.router.navigate(['/entrar']);
  }

  /**
   * O questionario em andamento fica guardado para o catalogo e o detalhe de profissao
   * poderem pedir a compatibilidade sem obrigar o estudante a refazer a jornada.
   */
  get assessmentId(): number | null {
    return this.storage.readAssessmentId();
  }

  rememberAssessment(assessmentId: number): void {
    this.storage.writeAssessmentId(assessmentId);
  }

  private startSession(response: AuthResponse): void {
    this.storage.writeToken(response.token);
    this.storage.writeStudent(response.student);
    this.tokenSignal.set(response.token);
    this.studentSignal.set(response.student);
  }
}
