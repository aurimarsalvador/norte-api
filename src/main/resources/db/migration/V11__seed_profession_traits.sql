-- Matriz profissao x trait. O peso (1 a 5) diz o quanto aquela caracteristica pesa no
-- dia a dia da profissao, e e o que alimenta o denominador do calculo de compatibilidade:
-- um trait exigido que o aluno nao pontuou derruba a compatibilidade, de proposito.
--
--   5 = central, a profissao se apoia nisso todos os dias
--   4 = muito presente
--   3 = presente com regularidade
--   2 = aparece de vez em quando
--   1 = marginal
INSERT INTO profession_traits (profession_id, trait_id, weight)
SELECT p.id, t.id, v.weight
FROM (
    VALUES
    -- Tecnologia e Computacao
    ('DESENVOLVEDOR_SOFTWARE',  'ANALISE_LOGICA',         5),
    ('DESENVOLVEDOR_SOFTWARE',  'RESOLUCAO_PROBLEMAS',    5),
    ('DESENVOLVEDOR_SOFTWARE',  'PERSISTENCIA',           4),
    ('DESENVOLVEDOR_SOFTWARE',  'ATENCAO_DETALHES',       4),
    ('DESENVOLVEDOR_SOFTWARE',  'CRIATIVIDADE',           3),
    ('DESENVOLVEDOR_SOFTWARE',  'TRABALHO_EQUIPE',        3),

    ('CIENTISTA_DADOS',         'ANALISE_LOGICA',         5),
    ('CIENTISTA_DADOS',         'CURIOSIDADE_CIENTIFICA', 5),
    ('CIENTISTA_DADOS',         'ATENCAO_DETALHES',       4),
    ('CIENTISTA_DADOS',         'RESOLUCAO_PROBLEMAS',    4),
    ('CIENTISTA_DADOS',         'COMUNICACAO',            3),

    ('ANALISTA_CIBERSEGURANCA', 'ANALISE_LOGICA',         5),
    ('ANALISTA_CIBERSEGURANCA', 'ATENCAO_DETALHES',       5),
    ('ANALISTA_CIBERSEGURANCA', 'PERSISTENCIA',           4),
    ('ANALISTA_CIBERSEGURANCA', 'RESOLUCAO_PROBLEMAS',    4),
    ('ANALISTA_CIBERSEGURANCA', 'CURIOSIDADE_CIENTIFICA', 3),

    ('DESIGNER_UX',             'CRIATIVIDADE',           5),
    ('DESIGNER_UX',             'EMPATIA',                5),
    ('DESIGNER_UX',             'COMUNICACAO',            4),
    ('DESIGNER_UX',             'EXPRESSAO_ARTISTICA',    4),
    ('DESIGNER_UX',             'ATENCAO_DETALHES',       3),

    ('ANALISTA_REDES',          'RESOLUCAO_PROBLEMAS',    5),
    ('ANALISTA_REDES',          'ATENCAO_DETALHES',       4),
    ('ANALISTA_REDES',          'ORGANIZACAO',            4),
    ('ANALISTA_REDES',          'ANALISE_LOGICA',         4),
    ('ANALISTA_REDES',          'PERSISTENCIA',           3),

    -- Saude e Bem-estar
    ('MEDICO',                  'EMPATIA',                5),
    ('MEDICO',                  'ANALISE_LOGICA',         5),
    ('MEDICO',                  'PERSISTENCIA',           5),
    ('MEDICO',                  'CURIOSIDADE_CIENTIFICA', 4),
    ('MEDICO',                  'COMUNICACAO',            4),
    ('MEDICO',                  'ATENCAO_DETALHES',       4),

    ('ENFERMEIRO',              'EMPATIA',                5),
    ('ENFERMEIRO',              'TRABALHO_EQUIPE',        5),
    ('ENFERMEIRO',              'ORGANIZACAO',            4),
    ('ENFERMEIRO',              'ATENCAO_DETALHES',       4),
    ('ENFERMEIRO',              'COMUNICACAO',            4),

    ('PSICOLOGO',               'EMPATIA',                5),
    ('PSICOLOGO',               'COMUNICACAO',            5),
    ('PSICOLOGO',               'ANALISE_LOGICA',         3),
    ('PSICOLOGO',               'PERSISTENCIA',           3),
    ('PSICOLOGO',               'CURIOSIDADE_CIENTIFICA', 3),

    ('FISIOTERAPEUTA',          'EMPATIA',                5),
    ('FISIOTERAPEUTA',          'HABILIDADE_MANUAL',      5),
    ('FISIOTERAPEUTA',          'PERSISTENCIA',           4),
    ('FISIOTERAPEUTA',          'COMUNICACAO',            3),
    ('FISIOTERAPEUTA',          'CURIOSIDADE_CIENTIFICA', 3),

    ('NUTRICIONISTA',           'EMPATIA',                4),
    ('NUTRICIONISTA',           'CURIOSIDADE_CIENTIFICA', 4),
    ('NUTRICIONISTA',           'COMUNICACAO',            4),
    ('NUTRICIONISTA',           'ATENCAO_DETALHES',       4),
    ('NUTRICIONISTA',           'ORGANIZACAO',            3),

    -- Negocios e Gestao
    ('ADMINISTRADOR',           'ORGANIZACAO',            5),
    ('ADMINISTRADOR',           'VISAO_NEGOCIO',          5),
    ('ADMINISTRADOR',           'LIDERANCA',              4),
    ('ADMINISTRADOR',           'COMUNICACAO',            4),
    ('ADMINISTRADOR',           'TRABALHO_EQUIPE',        3),

    ('CONTADOR',                'ATENCAO_DETALHES',       5),
    ('CONTADOR',                'ORGANIZACAO',            5),
    ('CONTADOR',                'ANALISE_LOGICA',         4),
    ('CONTADOR',                'PERSISTENCIA',           3),
    ('CONTADOR',                'VISAO_NEGOCIO',          3),

    ('ANALISTA_MARKETING',      'CRIATIVIDADE',           5),
    ('ANALISTA_MARKETING',      'COMUNICACAO',            5),
    ('ANALISTA_MARKETING',      'VISAO_NEGOCIO',          4),
    ('ANALISTA_MARKETING',      'ANALISE_LOGICA',         3),
    ('ANALISTA_MARKETING',      'EXPRESSAO_ARTISTICA',    3),

    ('EMPREENDEDOR',            'VISAO_NEGOCIO',          5),
    ('EMPREENDEDOR',            'LIDERANCA',              5),
    ('EMPREENDEDOR',            'PERSISTENCIA',           5),
    ('EMPREENDEDOR',            'CRIATIVIDADE',           4),
    ('EMPREENDEDOR',            'COMUNICACAO',            4),
    ('EMPREENDEDOR',            'RESOLUCAO_PROBLEMAS',    4),

    -- Engenharias e Ciencias
    ('ENGENHEIRO_CIVIL',        'ANALISE_LOGICA',         5),
    ('ENGENHEIRO_CIVIL',        'ORGANIZACAO',            5),
    ('ENGENHEIRO_CIVIL',        'ATENCAO_DETALHES',       4),
    ('ENGENHEIRO_CIVIL',        'RESOLUCAO_PROBLEMAS',    4),
    ('ENGENHEIRO_CIVIL',        'LIDERANCA',              3),
    ('ENGENHEIRO_CIVIL',        'HABILIDADE_MANUAL',      3),

    ('ENGENHEIRO_MECANICO',     'RESOLUCAO_PROBLEMAS',    5),
    ('ENGENHEIRO_MECANICO',     'HABILIDADE_MANUAL',      5),
    ('ENGENHEIRO_MECANICO',     'ANALISE_LOGICA',         5),
    ('ENGENHEIRO_MECANICO',     'ATENCAO_DETALHES',       4),
    ('ENGENHEIRO_MECANICO',     'PERSISTENCIA',           3),

    ('ENGENHEIRO_ELETRICO',     'ANALISE_LOGICA',         5),
    ('ENGENHEIRO_ELETRICO',     'RESOLUCAO_PROBLEMAS',    5),
    ('ENGENHEIRO_ELETRICO',     'ATENCAO_DETALHES',       5),
    ('ENGENHEIRO_ELETRICO',     'HABILIDADE_MANUAL',      4),
    ('ENGENHEIRO_ELETRICO',     'CURIOSIDADE_CIENTIFICA', 3),

    ('ARQUITETO',               'CRIATIVIDADE',           5),
    ('ARQUITETO',               'EXPRESSAO_ARTISTICA',    5),
    ('ARQUITETO',               'ATENCAO_DETALHES',       4),
    ('ARQUITETO',               'ORGANIZACAO',            4),
    ('ARQUITETO',               'COMUNICACAO',            3),

    ('BIOLOGO',                 'CURIOSIDADE_CIENTIFICA', 5),
    ('BIOLOGO',                 'ATENCAO_DETALHES',       5),
    ('BIOLOGO',                 'PERSISTENCIA',           4),
    ('BIOLOGO',                 'ANALISE_LOGICA',         4),
    ('BIOLOGO',                 'ORGANIZACAO',            3),

    -- Humanas, Educacao e Impacto Social
    ('PROFESSOR',               'COMUNICACAO',            5),
    ('PROFESSOR',               'EMPATIA',                5),
    ('PROFESSOR',               'ORGANIZACAO',            4),
    ('PROFESSOR',               'PERSISTENCIA',           4),
    ('PROFESSOR',               'CRIATIVIDADE',           3),
    ('PROFESSOR',               'LIDERANCA',              3),

    ('ADVOGADO',                'COMUNICACAO',            5),
    ('ADVOGADO',                'ANALISE_LOGICA',         5),
    ('ADVOGADO',                'PERSISTENCIA',           4),
    ('ADVOGADO',                'ATENCAO_DETALHES',       4),
    ('ADVOGADO',                'ORGANIZACAO',            3),

    ('ASSISTENTE_SOCIAL',       'EMPATIA',                5),
    ('ASSISTENTE_SOCIAL',       'COMUNICACAO',            4),
    ('ASSISTENTE_SOCIAL',       'TRABALHO_EQUIPE',        4),
    ('ASSISTENTE_SOCIAL',       'PERSISTENCIA',           4),
    ('ASSISTENTE_SOCIAL',       'ORGANIZACAO',            3),

    ('GESTOR_PUBLICO',          'ORGANIZACAO',            5),
    ('GESTOR_PUBLICO',          'LIDERANCA',              4),
    ('GESTOR_PUBLICO',          'ANALISE_LOGICA',         4),
    ('GESTOR_PUBLICO',          'COMUNICACAO',            4),
    ('GESTOR_PUBLICO',          'EMPATIA',                3),
    ('GESTOR_PUBLICO',          'VISAO_NEGOCIO',          3),

    -- Comunicacao e Artes
    ('JORNALISTA',              'COMUNICACAO',            5),
    ('JORNALISTA',              'CURIOSIDADE_CIENTIFICA', 4),
    ('JORNALISTA',              'PERSISTENCIA',           4),
    ('JORNALISTA',              'ATENCAO_DETALHES',       4),
    ('JORNALISTA',              'EMPATIA',                3),

    ('PUBLICITARIO',            'CRIATIVIDADE',           5),
    ('PUBLICITARIO',            'COMUNICACAO',            5),
    ('PUBLICITARIO',            'VISAO_NEGOCIO',          4),
    ('PUBLICITARIO',            'EXPRESSAO_ARTISTICA',    4),
    ('PUBLICITARIO',            'TRABALHO_EQUIPE',        3),

    ('DESIGNER_GRAFICO',        'EXPRESSAO_ARTISTICA',    5),
    ('DESIGNER_GRAFICO',        'CRIATIVIDADE',           5),
    ('DESIGNER_GRAFICO',        'ATENCAO_DETALHES',       4),
    ('DESIGNER_GRAFICO',        'COMUNICACAO',            3),

    ('PRODUTOR_AUDIOVISUAL',    'CRIATIVIDADE',           5),
    ('PRODUTOR_AUDIOVISUAL',    'EXPRESSAO_ARTISTICA',    5),
    ('PRODUTOR_AUDIOVISUAL',    'ORGANIZACAO',            4),
    ('PRODUTOR_AUDIOVISUAL',    'TRABALHO_EQUIPE',        4),
    ('PRODUTOR_AUDIOVISUAL',    'HABILIDADE_MANUAL',      3)
) AS v (profession_code, trait_code, weight)
JOIN professions p ON p.code = v.profession_code
JOIN traits t ON t.code = v.trait_code;
