import { Injectable } from '@angular/core';

import { Student } from './models/api.models';

const TOKEN_KEY = 'norte.token';
const STUDENT_KEY = 'norte.student';
const ASSESSMENT_KEY = 'norte.assessmentId';

/**
 * Leitura e escrita da sessao no localStorage.
 *
 * <p>Existe separado do AuthService de proposito: o interceptor precisa do token, e o
 * AuthService depende do HttpClient. Se o interceptor dependesse dele, teriamos um ciclo
 * de injecao (HttpClient -> interceptor -> AuthService -> ApiService -> HttpClient). Esta
 * classe nao depende de nada, entao quebra o ciclo.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  readToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  writeToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  readStudent(): Student | null {
    const stored = localStorage.getItem(STUDENT_KEY);
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored) as Student;
    } catch {
      // Storage corrompido nao pode derrubar a aplicacao no boot.
      localStorage.removeItem(STUDENT_KEY);
      return null;
    }
  }

  writeStudent(student: Student): void {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
  }

  readAssessmentId(): number | null {
    const stored = localStorage.getItem(ASSESSMENT_KEY);
    return stored ? Number(stored) : null;
  }

  writeAssessmentId(assessmentId: number): void {
    localStorage.setItem(ASSESSMENT_KEY, String(assessmentId));
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STUDENT_KEY);
    localStorage.removeItem(ASSESSMENT_KEY);
  }
}
