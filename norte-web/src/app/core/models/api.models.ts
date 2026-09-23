/**
 * Espelho dos DTOs da norte-api. Um unico lugar para todos eles: quando o contrato do
 * backend mudar, o TypeScript aponta cada tela afetada em vez de deixar o erro aparecer
 * em runtime.
 *
 * Percentuais chegam como string no JSON porque sao BigDecimal de escala 2 no backend.
 * Mantidos como `string` de proposito: converter para `number` cedo demais reintroduz o
 * erro de ponto flutuante que o backend teve o trabalho de evitar. Converta apenas na
 * hora de desenhar a barra.
 */

export interface AnswerOption {
  id: number;
  text: string;
  displayOrder: number;
}

export interface Question {
  id: number;
  code: string;
  text: string;
  displayOrder: number;
  options: AnswerOption[];
}

export interface Student {
  id: number;
  name: string;
  email: string;
  schoolYear: number;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
  student: Student;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  schoolYear: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type AssessmentStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface AssessmentAnswer {
  questionId: number;
  questionCode: string;
  answerOptionId: number;
  answeredAt: string;
}

export interface Assessment {
  id: number;
  status: AssessmentStatus;
  startedAt: string;
  completedAt: string | null;
  answeredCount: number;
  totalQuestions: number;
  minimumAnswersToComplete: number;
  answers: AssessmentAnswer[];
}

export interface TraitScore {
  traitId: number;
  code: string;
  name: string;
  description: string;
  percentage: string;
}

export interface Profile {
  assessmentId: number;
  status: AssessmentStatus;
  answeredQuestions: number;
  traits: TraitScore[];
}

export interface RecommendationReason {
  traitId: number;
  traitCode: string;
  traitName: string;
  percentage: string;
  professionWeight: number;
  description: string;
}

export interface Recommendation {
  professionId: number;
  professionCode: string;
  professionName: string;
  summary: string;
  careerAreaCode: string;
  careerAreaName: string;
  compatibility: string;
  reasons: RecommendationReason[];
}

export interface CareerArea {
  id: number;
  code: string;
  name: string;
  description: string;
}

export type InterestLevel = 'FAVORITE' | 'NEUTRAL' | 'NOT_INTERESTED';

export interface ProfessionSummary {
  id: number;
  code: string;
  name: string;
  summary: string;
  careerArea: CareerArea;
  compatibility: string | null;
  reasons: RecommendationReason[];
  interestLevel: InterestLevel | null;
}

export interface ProfessionTraitRequirement {
  traitId: number;
  code: string;
  name: string;
  description: string;
  weight: number;
}

export interface MicroExperience {
  id: number;
  professionId: number;
  professionName: string;
  title: string;
  instructions: string;
  estimatedMinutes: number;
}

export interface ProfessionDetail {
  id: number;
  code: string;
  name: string;
  summary: string;
  description: string;
  typicalActivities: string;
  educationPath: string;
  careerArea: CareerArea;
  requiredTraits: ProfessionTraitRequirement[];
  microExperience: MicroExperience | null;
  compatibility: string | null;
  reasons: RecommendationReason[];
  interestLevel: InterestLevel | null;
}

export interface MicroExperienceAnswer {
  id: number;
  microExperienceId: number;
  microExperienceTitle: string;
  professionId: number;
  professionName: string;
  enjoymentRating: number;
  difficultyRating: number;
  notes: string | null;
  respondedAt: string;
}

export interface MicroExperienceAnswerRequest {
  enjoymentRating: number;
  difficultyRating: number;
  notes?: string | null;
}

export interface Feedback {
  professionId: number;
  professionCode: string;
  professionName: string;
  interestLevel: InterestLevel;
  updatedAt: string;
}

export interface MyPathAssessmentSummary {
  id: number;
  status: AssessmentStatus;
  startedAt: string;
  completedAt: string | null;
  answeredQuestions: number;
}

export interface MyPath {
  student: Student;
  assessment: MyPathAssessmentSummary | null;
  topTraits: TraitScore[];
  favorites: Feedback[];
  discarded: Feedback[];
  microExperiences: MicroExperienceAnswer[];
  nextSteps: Recommendation[];
}

/** Corpo de erro RFC 7807 devolvido pela API. */
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  timestamp?: string;
  errors?: { field: string; message: string }[];
}
