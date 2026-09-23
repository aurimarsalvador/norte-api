import { COMO_FOI, DIFICULDADE, mensagemDeRetorno, rotuloDoSentimento } from './sentimento';

describe('sentimento', () => {
  it('toda opcao da tela vira uma nota aceita pela API (1 a 5)', () => {
    for (const opcao of [...COMO_FOI, ...DIFICULDADE]) {
      expect(opcao.value).toBeGreaterThanOrEqual(1);
      expect(opcao.value).toBeLessThanOrEqual(5);
    }
  });

  it('a nota de cada sentimento volta para o mesmo rotulo', () => {
    for (const opcao of COMO_FOI) {
      expect(rotuloDoSentimento(opcao.value)).toBe(opcao.label);
    }
  });

  it('notas baixas contam como "Não curti", e a resposta agradece a sinceridade', () => {
    expect(rotuloDoSentimento(2)).toBe('Não curti');
    expect(mensagemDeRetorno(1)).toContain('Valeu pela sinceridade');
  });
});
