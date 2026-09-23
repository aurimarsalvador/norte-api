-- As opcoes sao ligadas a questao pelo texto dela, e nao por um id fixo: o id da
-- primeira questao depende da ordem de execucao das migrations e nao e estavel.
INSERT INTO answer_options (question_id, text, display_order)
SELECT q.id, opcao.text, opcao.display_order
FROM questions q
CROSS JOIN (
    VALUES
        ('Descobrir exatamente por que isso aconteceu.', 1),
        ('Tentar consertar ou resolver na prática.', 2),
        ('Pesquisar até entender como aquilo funciona.', 3),
        ('Pedir ajuda a alguém que entende do assunto.', 4)
) AS opcao (text, display_order)
WHERE q.text = 'Quando alguma coisa não funciona, o que você sente mais vontade de fazer?';
