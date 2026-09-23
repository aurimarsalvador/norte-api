-- Pesos de cada alternativa sobre os traits (1 a 5). Este e o insumo do ProfileCalculator:
-- a soma dos pesos das opcoes escolhidas vira S_raw(t), e o maior peso disponivel em cada
-- questao respondida vira S_max(t). Alternativas sao referenciadas por
-- (codigo da questao, ordem da alternativa), nunca por id.
INSERT INTO option_trait_weights (answer_option_id, trait_id, weight)
SELECT ao.id, t.id, v.weight
FROM (
    VALUES
    -- Q01 - Quando alguma coisa nao funciona
    ('Q01_PROBLEMA_TRAVADO', 1, 'ANALISE_LOGICA',         5),
    ('Q01_PROBLEMA_TRAVADO', 1, 'CURIOSIDADE_CIENTIFICA', 4),
    ('Q01_PROBLEMA_TRAVADO', 1, 'RESOLUCAO_PROBLEMAS',    3),
    ('Q01_PROBLEMA_TRAVADO', 2, 'HABILIDADE_MANUAL',      5),
    ('Q01_PROBLEMA_TRAVADO', 2, 'RESOLUCAO_PROBLEMAS',    5),
    ('Q01_PROBLEMA_TRAVADO', 2, 'PERSISTENCIA',           3),
    ('Q01_PROBLEMA_TRAVADO', 3, 'CURIOSIDADE_CIENTIFICA', 5),
    ('Q01_PROBLEMA_TRAVADO', 3, 'PERSISTENCIA',           4),
    ('Q01_PROBLEMA_TRAVADO', 3, 'ANALISE_LOGICA',         3),
    ('Q01_PROBLEMA_TRAVADO', 4, 'TRABALHO_EQUIPE',        5),
    ('Q01_PROBLEMA_TRAVADO', 4, 'COMUNICACAO',            4),
    ('Q01_PROBLEMA_TRAVADO', 4, 'EMPATIA',                2),

    -- Q02 - Papel no trabalho em grupo
    ('Q02_TRABALHO_GRUPO', 1, 'ORGANIZACAO',         5),
    ('Q02_TRABALHO_GRUPO', 1, 'LIDERANCA',           4),
    ('Q02_TRABALHO_GRUPO', 1, 'TRABALHO_EQUIPE',     3),
    ('Q02_TRABALHO_GRUPO', 2, 'COMUNICACAO',         5),
    ('Q02_TRABALHO_GRUPO', 2, 'LIDERANCA',           3),
    ('Q02_TRABALHO_GRUPO', 2, 'EXPRESSAO_ARTISTICA', 2),
    ('Q02_TRABALHO_GRUPO', 3, 'CURIOSIDADE_CIENTIFICA', 5),
    ('Q02_TRABALHO_GRUPO', 3, 'ANALISE_LOGICA',      4),
    ('Q02_TRABALHO_GRUPO', 3, 'PERSISTENCIA',        3),
    ('Q02_TRABALHO_GRUPO', 4, 'EXPRESSAO_ARTISTICA', 5),
    ('Q02_TRABALHO_GRUPO', 4, 'CRIATIVIDADE',        5),
    ('Q02_TRABALHO_GRUPO', 4, 'ATENCAO_DETALHES',    3),

    -- Q03 - Colega abalado
    ('Q03_COLEGA_ABALADO', 1, 'EMPATIA',             5),
    ('Q03_COLEGA_ABALADO', 1, 'COMUNICACAO',         3),
    ('Q03_COLEGA_ABALADO', 1, 'TRABALHO_EQUIPE',     2),
    ('Q03_COLEGA_ABALADO', 2, 'RESOLUCAO_PROBLEMAS', 5),
    ('Q03_COLEGA_ABALADO', 2, 'ANALISE_LOGICA',      4),
    ('Q03_COLEGA_ABALADO', 2, 'EMPATIA',             3),
    ('Q03_COLEGA_ABALADO', 3, 'TRABALHO_EQUIPE',     5),
    ('Q03_COLEGA_ABALADO', 3, 'LIDERANCA',           3),
    ('Q03_COLEGA_ABALADO', 3, 'EMPATIA',             3),
    ('Q03_COLEGA_ABALADO', 4, 'CURIOSIDADE_CIENTIFICA', 4),
    ('Q03_COLEGA_ABALADO', 4, 'ORGANIZACAO',         3),
    ('Q03_COLEGA_ABALADO', 4, 'EMPATIA',             2),

    -- Q04 - Tarde livre
    ('Q04_TARDE_LIVRE', 1, 'HABILIDADE_MANUAL',   5),
    ('Q04_TARDE_LIVRE', 1, 'RESOLUCAO_PROBLEMAS', 3),
    ('Q04_TARDE_LIVRE', 1, 'PERSISTENCIA',        3),
    ('Q04_TARDE_LIVRE', 2, 'EXPRESSAO_ARTISTICA', 5),
    ('Q04_TARDE_LIVRE', 2, 'CRIATIVIDADE',        5),
    ('Q04_TARDE_LIVRE', 3, 'ANALISE_LOGICA',      5),
    ('Q04_TARDE_LIVRE', 3, 'RESOLUCAO_PROBLEMAS', 4),
    ('Q04_TARDE_LIVRE', 3, 'PERSISTENCIA',        3),
    ('Q04_TARDE_LIVRE', 4, 'ORGANIZACAO',         5),
    ('Q04_TARDE_LIVRE', 4, 'ATENCAO_DETALHES',    4),
    ('Q04_TARDE_LIVRE', 4, 'PERSISTENCIA',        2),

    -- Q05 - Noticia que prende a atencao
    ('Q05_NOTICIA', 1, 'CURIOSIDADE_CIENTIFICA', 5),
    ('Q05_NOTICIA', 1, 'EMPATIA',                3),
    ('Q05_NOTICIA', 1, 'ANALISE_LOGICA',         3),
    ('Q05_NOTICIA', 2, 'VISAO_NEGOCIO',          5),
    ('Q05_NOTICIA', 2, 'LIDERANCA',              3),
    ('Q05_NOTICIA', 2, 'ORGANIZACAO',            2),
    ('Q05_NOTICIA', 3, 'CURIOSIDADE_CIENTIFICA', 4),
    ('Q05_NOTICIA', 3, 'CRIATIVIDADE',           4),
    ('Q05_NOTICIA', 3, 'ANALISE_LOGICA',         3),
    ('Q05_NOTICIA', 4, 'EMPATIA',                5),
    ('Q05_NOTICIA', 4, 'TRABALHO_EQUIPE',        4),
    ('Q05_NOTICIA', 4, 'COMUNICACAO',            3),

    -- Q06 - Trabalho grande em duas semanas
    ('Q06_TRABALHO_GRANDE', 1, 'ORGANIZACAO',         5),
    ('Q06_TRABALHO_GRANDE', 1, 'PERSISTENCIA',        4),
    ('Q06_TRABALHO_GRANDE', 1, 'ATENCAO_DETALHES',    3),
    ('Q06_TRABALHO_GRANDE', 2, 'RESOLUCAO_PROBLEMAS', 5),
    ('Q06_TRABALHO_GRANDE', 2, 'PERSISTENCIA',        5),
    ('Q06_TRABALHO_GRANDE', 3, 'LIDERANCA',           5),
    ('Q06_TRABALHO_GRANDE', 3, 'TRABALHO_EQUIPE',     5),
    ('Q06_TRABALHO_GRANDE', 3, 'COMUNICACAO',         3),
    ('Q06_TRABALHO_GRANDE', 4, 'CRIATIVIDADE',        5),
    ('Q06_TRABALHO_GRANDE', 4, 'EXPRESSAO_ARTISTICA', 3),
    ('Q06_TRABALHO_GRANDE', 4, 'VISAO_NEGOCIO',       2),

    -- Q07 - O que mais incomoda
    ('Q07_INCOMODO', 1, 'ATENCAO_DETALHES',       5),
    ('Q07_INCOMODO', 1, 'ORGANIZACAO',            3),
    ('Q07_INCOMODO', 2, 'ANALISE_LOGICA',         5),
    ('Q07_INCOMODO', 2, 'CURIOSIDADE_CIENTIFICA', 3),
    ('Q07_INCOMODO', 3, 'COMUNICACAO',            5),
    ('Q07_INCOMODO', 3, 'EMPATIA',                2),
    ('Q07_INCOMODO', 4, 'CRIATIVIDADE',           5),
    ('Q07_INCOMODO', 4, 'EXPRESSAO_ARTISTICA',    3),

    -- Q08 - Evento da turma
    ('Q08_EVENTO_TURMA', 1, 'LIDERANCA',           5),
    ('Q08_EVENTO_TURMA', 1, 'ORGANIZACAO',         5),
    ('Q08_EVENTO_TURMA', 2, 'VISAO_NEGOCIO',       5),
    ('Q08_EVENTO_TURMA', 2, 'ORGANIZACAO',         3),
    ('Q08_EVENTO_TURMA', 2, 'COMUNICACAO',         3),
    ('Q08_EVENTO_TURMA', 3, 'CRIATIVIDADE',        5),
    ('Q08_EVENTO_TURMA', 3, 'EXPRESSAO_ARTISTICA', 4),
    ('Q08_EVENTO_TURMA', 3, 'COMUNICACAO',         3),
    ('Q08_EVENTO_TURMA', 4, 'HABILIDADE_MANUAL',   5),
    ('Q08_EVENTO_TURMA', 4, 'TRABALHO_EQUIPE',     3),
    ('Q08_EVENTO_TURMA', 4, 'RESOLUCAO_PROBLEMAS', 3),

    -- Q09 - Elogio que mais orgulha
    ('Q09_ELOGIO', 1, 'COMUNICACAO',         5),
    ('Q09_ELOGIO', 1, 'EMPATIA',             3),
    ('Q09_ELOGIO', 2, 'ATENCAO_DETALHES',    5),
    ('Q09_ELOGIO', 2, 'ANALISE_LOGICA',      3),
    ('Q09_ELOGIO', 3, 'PERSISTENCIA',        5),
    ('Q09_ELOGIO', 3, 'RESOLUCAO_PROBLEMAS', 4),
    ('Q09_ELOGIO', 4, 'CRIATIVIDADE',        5),
    ('Q09_ELOGIO', 4, 'EXPRESSAO_ARTISTICA', 3),

    -- Q10 - Regra injusta
    ('Q10_REGRA_INJUSTA', 1, 'COMUNICACAO',            5),
    ('Q10_REGRA_INJUSTA', 1, 'ANALISE_LOGICA',         4),
    ('Q10_REGRA_INJUSTA', 1, 'LIDERANCA',              3),
    ('Q10_REGRA_INJUSTA', 2, 'LIDERANCA',              5),
    ('Q10_REGRA_INJUSTA', 2, 'TRABALHO_EQUIPE',        4),
    ('Q10_REGRA_INJUSTA', 2, 'EMPATIA',                3),
    ('Q10_REGRA_INJUSTA', 3, 'CURIOSIDADE_CIENTIFICA', 4),
    ('Q10_REGRA_INJUSTA', 3, 'ANALISE_LOGICA',         3),
    ('Q10_REGRA_INJUSTA', 3, 'EMPATIA',                3),
    ('Q10_REGRA_INJUSTA', 4, 'ORGANIZACAO',            4),
    ('Q10_REGRA_INJUSTA', 4, 'ATENCAO_DETALHES',       3),
    ('Q10_REGRA_INJUSTA', 4, 'PERSISTENCIA',           2),

    -- Q11 - Ambiente de trabalho
    ('Q11_AMBIENTE_TRABALHO', 1, 'CURIOSIDADE_CIENTIFICA', 5),
    ('Q11_AMBIENTE_TRABALHO', 1, 'ATENCAO_DETALHES',       4),
    ('Q11_AMBIENTE_TRABALHO', 1, 'PERSISTENCIA',           3),
    ('Q11_AMBIENTE_TRABALHO', 2, 'HABILIDADE_MANUAL',      5),
    ('Q11_AMBIENTE_TRABALHO', 2, 'RESOLUCAO_PROBLEMAS',    3),
    ('Q11_AMBIENTE_TRABALHO', 2, 'TRABALHO_EQUIPE',        2),
    ('Q11_AMBIENTE_TRABALHO', 3, 'EMPATIA',                5),
    ('Q11_AMBIENTE_TRABALHO', 3, 'COMUNICACAO',            4),
    ('Q11_AMBIENTE_TRABALHO', 3, 'TRABALHO_EQUIPE',        3),
    ('Q11_AMBIENTE_TRABALHO', 4, 'EXPRESSAO_ARTISTICA',    5),
    ('Q11_AMBIENTE_TRABALHO', 4, 'CRIATIVIDADE',           5),
    ('Q11_AMBIENTE_TRABALHO', 4, 'COMUNICACAO',            3),

    -- Q12 - Daqui a dez anos
    ('Q12_DEZ_ANOS', 1, 'VISAO_NEGOCIO',          5),
    ('Q12_DEZ_ANOS', 1, 'PERSISTENCIA',           4),
    ('Q12_DEZ_ANOS', 1, 'LIDERANCA',              3),
    ('Q12_DEZ_ANOS', 2, 'EMPATIA',                5),
    ('Q12_DEZ_ANOS', 2, 'COMUNICACAO',            3),
    ('Q12_DEZ_ANOS', 2, 'TRABALHO_EQUIPE',        3),
    ('Q12_DEZ_ANOS', 3, 'CURIOSIDADE_CIENTIFICA', 5),
    ('Q12_DEZ_ANOS', 3, 'CRIATIVIDADE',           4),
    ('Q12_DEZ_ANOS', 3, 'PERSISTENCIA',           3),
    ('Q12_DEZ_ANOS', 4, 'ANALISE_LOGICA',         4),
    ('Q12_DEZ_ANOS', 4, 'ATENCAO_DETALHES',       4),
    ('Q12_DEZ_ANOS', 4, 'PERSISTENCIA',           4)
) AS v (question_code, option_order, trait_code, weight)
JOIN questions q ON q.code = v.question_code
JOIN answer_options ao ON ao.question_id = q.id AND ao.display_order = v.option_order
JOIN traits t ON t.code = v.trait_code;
