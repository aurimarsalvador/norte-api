import { SentimentOption } from './sentiment-scale';

/**
 * A API guarda notas de 1 a 5 (enjoymentRating e difficultyRating); a tela fala em
 * sentimentos. Este arquivo e a unica traducao entre os dois, nos dois sentidos.
 */

export const COMO_FOI: SentimentOption<number>[] = [
  { value: 5, label: 'Amei', icon: 'laugh' },
  { value: 4, label: 'Curti', icon: 'smile' },
  { value: 3, label: 'Neutro', icon: 'meh' },
  { value: 1, label: 'Não curti', icon: 'frown' },
];

export const DIFICULDADE: SentimentOption<number>[] = [
  { value: 1, label: 'Fácil' },
  { value: 3, label: 'Na medida' },
  { value: 4, label: 'Deu trabalho' },
  { value: 5, label: 'Muito difícil' },
];

/** Rotulo do sentimento para uma nota vinda da API. Notas 1 e 2 contam como "Não curti". */
export function rotuloDoSentimento(enjoymentRating: number): string {
  if (enjoymentRating >= 5) return 'Amei';
  if (enjoymentRating === 4) return 'Curti';
  if (enjoymentRating === 3) return 'Neutro';
  return 'Não curti';
}

/** Resposta depois do envio: celebra o que agradou e agradece a sinceridade no que nao. */
export function mensagemDeRetorno(enjoymentRating: number): string {
  if (enjoymentRating >= 4) {
    return 'Que bom! Essa profissão ganhou destaque no seu caminho.';
  }
  if (enjoymentRating === 3) {
    return 'Tudo bem. Às vezes a gente só descobre experimentando mais.';
  }
  return 'Valeu pela sinceridade. Saber o que não combina também ajuda a achar o que combina.';
}
