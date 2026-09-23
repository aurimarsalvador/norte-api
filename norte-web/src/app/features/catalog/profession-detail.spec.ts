import { RecommendationReason } from '../../core/models/api.models';
import { explicar } from './profession-detail';

function razao(traitName: string): RecommendationReason {
  return {
    traitId: traitName.length,
    traitCode: traitName.toUpperCase(),
    traitName,
    percentage: '80.00',
    professionWeight: 3,
    description: '',
  };
}

describe('explicar', () => {
  it('lista as caracteristicas em portugues, com "e" antes da ultima', () => {
    const texto = explicar([razao('Tecnologia'), razao('Investigação'), razao('Resolução de problemas')]);
    expect(texto).toBe(
      'Apareceu aqui porque suas respostas mostraram interesse em tecnologia, investigação e resolução de problemas.',
    );
  });

  it('com uma so caracteristica, nao sobra virgula nem "e"', () => {
    expect(explicar([razao('Criatividade')])).toBe(
      'Apareceu aqui porque suas respostas mostraram interesse em criatividade.',
    );
  });

  it('sem justificativas, convida a explorar em vez de improvisar uma', () => {
    const texto = explicar([]);
    expect(texto).not.toContain('Apareceu aqui porque');
    expect(texto).toContain('Isso não a descarta');
  });
});
