-- Questionario situacional completo. A questao 1 ja existe desde a V2/V4; aqui entram
-- da 2 a 12. Nenhuma pergunta e clinica ou sensivel: todas descrevem situacoes do dia a dia
-- e deixam a leitura do resultado para o motor de recomendacao.
INSERT INTO questions (code, text, display_order, active)
VALUES
    ('Q02_TRABALHO_GRUPO',      'Em um trabalho em grupo da escola, qual papel você costuma assumir?', 2, TRUE),
    ('Q03_COLEGA_ABALADO',      'Um colega chega abalado com um problema pessoal. Qual é a sua reação mais natural?', 3, TRUE),
    ('Q04_TARDE_LIVRE',         'Você tem uma tarde inteira livre, sem celular. O que faria com mais prazer?', 4, TRUE),
    ('Q05_NOTICIA',             'Qual dessas notícias faria você parar para ler até o fim?', 5, TRUE),
    ('Q06_TRABALHO_GRANDE',     'Você precisa entregar um trabalho grande em duas semanas. Como age?', 6, TRUE),
    ('Q07_INCOMODO',            'O que mais incomoda você em um trabalho entregue por outra pessoa?', 7, TRUE),
    ('Q08_EVENTO_TURMA',        'Sua turma vai organizar um evento. Onde você se encaixaria melhor?', 8, TRUE),
    ('Q09_ELOGIO',              'Qual desses elogios deixaria você mais orgulhoso?', 9, TRUE),
    ('Q10_REGRA_INJUSTA',       'Diante de uma regra que você considera injusta, o que faz?', 10, TRUE),
    ('Q11_AMBIENTE_TRABALHO',   'Em qual desses ambientes você se imagina trabalhando melhor?', 11, TRUE),
    ('Q12_DEZ_ANOS',            'Daqui a dez anos, o que faria você sentir que valeu a pena?', 12, TRUE);

INSERT INTO answer_options (question_id, text, display_order)
SELECT q.id, v.text, v.display_order
FROM (
    VALUES
    ('Q02_TRABALHO_GRUPO', 'Organizo o cronograma e distribuo as tarefas.', 1),
    ('Q02_TRABALHO_GRUPO', 'Fico responsável por apresentar o resultado para a turma.', 2),
    ('Q02_TRABALHO_GRUPO', 'Mergulho na pesquisa e trago o conteúdo para o grupo.', 3),
    ('Q02_TRABALHO_GRUPO', 'Cuido do visual: slides, cartaz, identidade do trabalho.', 4),

    ('Q03_COLEGA_ABALADO', 'Escuto com calma e acolho antes de dar qualquer conselho.', 1),
    ('Q03_COLEGA_ABALADO', 'Ajudo a mapear o problema e a pensar em saídas possíveis.', 2),
    ('Q03_COLEGA_ABALADO', 'Chamo outras pessoas para que a gente apoie junto.', 3),
    ('Q03_COLEGA_ABALADO', 'Procuro informação confiável sobre o assunto para orientar melhor.', 4),

    ('Q04_TARDE_LIVRE', 'Montar, consertar ou construir alguma coisa com as mãos.', 1),
    ('Q04_TARDE_LIVRE', 'Desenhar, escrever, tocar ou editar algo criativo.', 2),
    ('Q04_TARDE_LIVRE', 'Resolver desafios lógicos, quebra-cabeças ou jogos de estratégia.', 3),
    ('Q04_TARDE_LIVRE', 'Organizar meus planos e colocar a minha vida em ordem.', 4),

    ('Q05_NOTICIA', 'Uma descoberta científica que mudou o tratamento de uma doença.', 1),
    ('Q05_NOTICIA', 'Um negócio pequeno que cresceu e virou referência no setor.', 2),
    ('Q05_NOTICIA', 'Uma tecnologia nova que ninguém tinha imaginado antes.', 3),
    ('Q05_NOTICIA', 'Um projeto social que transformou a vida de uma comunidade.', 4),

    ('Q06_TRABALHO_GRANDE', 'Divido em etapas e sigo um cronograma do começo ao fim.', 1),
    ('Q06_TRABALHO_GRANDE', 'Começo pela parte mais difícil e vou destravando o resto.', 2),
    ('Q06_TRABALHO_GRANDE', 'Reúno o grupo e combino quem faz o quê.', 3),
    ('Q06_TRABALHO_GRANDE', 'Penso primeiro em um jeito diferente de fazer o trabalho.', 4),

    ('Q07_INCOMODO', 'Detalhes errados que ninguém se deu ao trabalho de revisar.', 1),
    ('Q07_INCOMODO', 'Uma conclusão que os dados apresentados não sustentam.', 2),
    ('Q07_INCOMODO', 'Uma explicação confusa, que ninguém consegue entender.', 3),
    ('Q07_INCOMODO', 'Falta de originalidade: tudo igual ao que já existe.', 4),

    ('Q08_EVENTO_TURMA', 'Coordenando tudo e acompanhando os prazos de cada um.', 1),
    ('Q08_EVENTO_TURMA', 'Cuidando do orçamento, dos patrocínios e das parcerias.', 2),
    ('Q08_EVENTO_TURMA', 'Criando a divulgação, o visual e os vídeos.', 3),
    ('Q08_EVENTO_TURMA', 'Montando a estrutura física: som, palco, montagem.', 4),

    ('Q09_ELOGIO', 'Que você explica de um jeito que todo mundo entende.', 1),
    ('Q09_ELOGIO', 'Que você percebe o que passa despercebido para os outros.', 2),
    ('Q09_ELOGIO', 'Que você não desiste enquanto não resolve.', 3),
    ('Q09_ELOGIO', 'Que as suas ideias são fora do comum.', 4),

    ('Q10_REGRA_INJUSTA', 'Reúno argumentos e apresento uma proposta melhor.', 1),
    ('Q10_REGRA_INJUSTA', 'Mobilizo outras pessoas para mudar aquilo junto.', 2),
    ('Q10_REGRA_INJUSTA', 'Procuro entender o motivo da regra antes de julgar.', 3),
    ('Q10_REGRA_INJUSTA', 'Sigo a regra, mas registro o problema para quem decide.', 4),

    ('Q11_AMBIENTE_TRABALHO', 'Um laboratório ou espaço de pesquisa.', 1),
    ('Q11_AMBIENTE_TRABALHO', 'Em campo, na obra ou na oficina, com as mãos ocupadas.', 2),
    ('Q11_AMBIENTE_TRABALHO', 'Atendendo e cuidando de pessoas o dia inteiro.', 3),
    ('Q11_AMBIENTE_TRABALHO', 'Em um estúdio criativo, produzindo conteúdo.', 4),

    ('Q12_DEZ_ANOS', 'Ter construído algo próprio, do zero.', 1),
    ('Q12_DEZ_ANOS', 'Ter ajudado muitas pessoas de perto.', 2),
    ('Q12_DEZ_ANOS', 'Ter descoberto ou criado algo que ninguém tinha feito.', 3),
    ('Q12_DEZ_ANOS', 'Ter virado referência técnica naquilo que faço.', 4)
) AS v (question_code, text, display_order)
JOIN questions q ON q.code = v.question_code;
