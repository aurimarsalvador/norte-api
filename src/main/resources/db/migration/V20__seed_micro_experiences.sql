-- Uma microexperiencia por profissao: uma tarefa curta, executavel em casa, que coloca o
-- aluno em contato com o gesto real do oficio. A avaliacao que ele faz depois (o quanto
-- gostou, o quanto achou dificil) vale mais para a jornada do que o resultado da tarefa.
INSERT INTO micro_experiences (profession_id, title, instructions, estimated_minutes)
SELECT p.id, v.title, v.instructions, v.estimated_minutes
FROM (
    VALUES
    ('DESENVOLVEDOR_SOFTWARE',
     'Automatize uma tarefa chata do seu dia',
     'Escolha algo repetitivo que você faz no computador (renomear fotos, somar uma lista, organizar arquivos). Descreva no papel os passos exatos, em ordem, como se fosse explicar para alguém que nunca viu a tarefa. Depois procure um tutorial de uma linguagem qualquer e tente escrever essas etapas em código, mesmo que só metade funcione. Repare no que você sentiu quando algo não funcionou de primeira.',
     45),

    ('CIENTISTA_DADOS',
     'Encontre uma resposta escondida em uma planilha',
     'Escolha uma pergunta sobre a sua turma que dê para responder com números (quem gasta mais tempo no transporte, qual matéria tem mais nota baixa). Colete os dados de pelo menos dez colegas em uma planilha. Faça um gráfico e escreva três frases: o que o gráfico mostra, o que ele não mostra e o que você precisaria saber para ter certeza.',
     50),

    ('ANALISTA_CIBERSEGURANCA',
     'Audite a segurança das suas próprias contas',
     'Liste cinco serviços em que você tem conta. Para cada um, verifique se a senha é repetida, se existe verificação em duas etapas ativada e quais aplicativos de terceiros têm acesso. Anote as falhas encontradas e escreva um plano de correção em ordem de risco, da mais perigosa para a menos. Corrija pelo menos a primeira.',
     40),

    ('DESIGNER_UX',
     'Descubra onde as pessoas travam em um aplicativo',
     'Peça a duas pessoas que façam uma tarefa simples em um aplicativo que elas não conhecem (por exemplo, encontrar o horário de um ônibus). Não ajude e não explique: apenas observe e anote cada hesitação. Depois, redesenhe no papel a tela onde elas mais travaram, com a sua proposta de solução.',
     45),

    ('ANALISTA_REDES',
     'Mapeie a rede da sua casa',
     'Desenhe em uma folha tudo que está conectado à internet na sua casa e como cada aparelho chega até o roteador. Acesse as configurações do roteador e descubra quantos dispositivos estão conectados agora. Anote o que mais consome banda e proponha uma mudança para melhorar o sinal no cômodo com pior conexão.',
     40),

    ('MEDICO',
     'Construa um raciocínio diagnóstico',
     'Escolha um sintoma comum (dor de cabeça persistente, cansaço, febre baixa) e pesquise em fontes confiáveis, como sociedades médicas e ministério da saúde, pelo menos quatro causas possíveis. Para cada uma, anote que pergunta você faria ao paciente e que exame ajudaria a confirmar ou descartar. Repare que o trabalho é eliminar hipóteses, não adivinhar a certa.',
     50),

    ('ENFERMEIRO',
     'Organize o cuidado de um dia inteiro',
     'Imagine quatro pacientes com necessidades diferentes: um precisa de medicação de seis em seis horas, outro de curativo duas vezes ao dia, outro de acompanhamento de sinais vitais de hora em hora e outro está prestes a receber alta. Monte a escala de um turno de seis horas atendendo todos. Depois, insira um imprevisto no meio do turno e refaça a escala.',
     40),

    ('PSICOLOGO',
     'Pratique escuta sem dar conselho',
     'Combine com alguém de confiança uma conversa de quinze minutos em que essa pessoa fale de algo que a incomoda. A sua única tarefa é escutar e devolver o que entendeu, sem sugerir solução nenhuma. Ao final, escreva como foi segurar o impulso de aconselhar e o que você percebeu que não teria percebido se estivesse falando.',
     30),

    ('FISIOTERAPEUTA',
     'Analise um movimento do corpo',
     'Filme alguém (ou você mesmo) agachando cinco vezes, de lado e de frente. Pesquise quais articulações e músculos participam do agachamento. Assista ao vídeo em câmera lenta e anote onde o movimento sai do alinhamento. Proponha um exercício simples para corrigir o que encontrou.',
     35),

    ('NUTRICIONISTA',
     'Traduza um rótulo para a vida real',
     'Escolha três produtos industrializados da sua casa e leia a tabela nutricional inteira. Calcule quanto de açúcar e de sódio você consumiria se comesse uma porção por dia durante uma semana. Depois, monte uma alternativa caseira para um deles que respeite o orçamento e o tempo de preparo da sua família.',
     40),

    ('ADMINISTRADOR',
     'Diagnostique um processo que não funciona',
     'Escolha um processo bagunçado que você conhece de perto (a fila da cantina, a entrega de trabalhos na escola, a organização de um grupo). Mapeie cada etapa e marque onde o tempo é perdido. Proponha duas mudanças e estime o ganho de cada uma. Apresente a proposta para alguém envolvido e ouça a objeção.',
     45),

    ('CONTADOR',
     'Feche o mês de um pequeno negócio',
     'Invente ou peça a alguém os números de um negócio pequeno: o que entrou e o que saiu em um mês. Separe custos fixos de variáveis, calcule o lucro e descubra o ponto de equilíbrio, ou seja, quanto precisa vender para não ter prejuízo. Confira duas vezes: um erro de digitação muda a conclusão inteira.',
     50),

    ('ANALISTA_MARKETING',
     'Desmonte uma campanha que funcionou com você',
     'Escolha um anúncio que fez você querer comprar algo. Identifique o público que ele buscava, a promessa central, o canal escolhido e o gatilho usado. Depois, escreva uma versão da mesma campanha para um público oposto ao seu e explique o que precisou mudar.',
     35),

    ('EMPREENDEDOR',
     'Valide uma ideia antes de construí-la',
     'Pense em um problema real que você vê perto de você e uma solução possível. Antes de qualquer coisa, converse com cinco pessoas que têm esse problema e pergunte como elas lidam com ele hoje e quanto pagariam por uma solução. Anote as respostas e escreva honestamente se a sua ideia sobreviveu à conversa.',
     60),

    ('ENGENHEIRO_CIVIL',
     'Projete e orce uma reforma pequena',
     'Meça um cômodo da sua casa e desenhe a planta em escala, com portas e janelas. Planeje uma mudança simples, como trocar o piso, e calcule a quantidade exata de material necessária, incluindo perda. Pesquise preços reais e monte o orçamento. Compare o resultado com o seu palpite inicial.',
     60),

    ('ENGENHEIRO_MECANICO',
     'Desmonte e entenda um mecanismo',
     'Escolha um objeto mecânico simples e sem uso (uma caneta retrátil, um ventilador velho, uma fechadura) e desmonte peça por peça, fotografando cada etapa. Desenhe como as peças transmitem movimento entre si. Monte tudo de volta e verifique se ainda funciona.',
     45),

    ('ENGENHEIRO_ELETRICO',
     'Meça o consumo real da sua casa',
     'Liste os aparelhos elétricos da sua casa e a potência de cada um, indicada na etiqueta. Estime quantas horas por dia cada um fica ligado e calcule o consumo mensal em quilowatt-hora. Compare o total com a conta de luz e investigue a diferença. Identifique os três maiores consumidores.',
     45),

    ('ARQUITETO',
     'Redesenhe um espaço que não funciona',
     'Escolha um ambiente que você acha mal resolvido, na escola ou em casa. Meça, desenhe a planta atual e observe durante meia hora como as pessoas circulam por ele. Proponha uma nova disposição que resolva o problema que você observou, respeitando as paredes que não podem cair.',
     55),

    ('BIOLOGO',
     'Faça um inventário de vida em um quarteirão',
     'Escolha um trecho pequeno de rua, praça ou quintal. Durante trinta minutos, registre por foto e anotação toda espécie que encontrar, de planta a inseto. Depois, tente identificar pelo menos cinco delas com um aplicativo ou guia. Anote quantas você não conseguiu identificar: isso também é resultado.',
     50),

    ('PROFESSOR',
     'Ensine algo difícil em dez minutos',
     'Escolha um conceito que você domina e que a maioria acha difícil. Prepare uma explicação de dez minutos para alguém que não sabe nada do assunto, com pelo menos um exemplo do cotidiano dessa pessoa. Ensine de verdade e, ao final, peça que ela explique de volta para você. O que ela não conseguiu repetir é o que a sua explicação não cobriu.',
     40),

    ('ADVOGADO',
     'Construa os dois lados de uma discussão',
     'Escolha um caso polêmico real, de preferência com decisão judicial publicada. Escreva meia página defendendo um lado, usando apenas fatos e regras, sem opinião. Depois escreva meia página defendendo o lado contrário com a mesma seriedade. Repare em qual dos dois foi mais difícil e por quê.',
     50),

    ('ASSISTENTE_SOCIAL',
     'Mapeie a rede de proteção do seu bairro',
     'Descubra quais serviços públicos existem perto de você: unidade de saúde, CRAS, conselho tutelar, defensoria, programas de transferência de renda. Anote endereço, horário e o que cada um atende. Depois, escolha uma situação concreta, como uma família sem renda com criança fora da escola, e escreva o caminho que ela teria que percorrer.',
     50),

    ('GESTOR_PUBLICO',
     'Priorize um orçamento que não cobre tudo',
     'Imagine que você administra um orçamento fixo para o seu bairro e recebeu cinco demandas: mais iluminação, reforma da escola, posto de saúde aberto à noite, praça acessível e coleta de lixo ampliada. O dinheiro cobre apenas duas. Defina os critérios de escolha antes de decidir, aplique-os e escreva a justificativa pública das duas escolhas.',
     45),

    ('JORNALISTA',
     'Cheque uma notícia antes de acreditar nela',
     'Pegue uma notícia que circulou no seu grupo de mensagens. Rastreie a origem: quem publicou primeiro, quando, com que fonte. Procure pelo menos duas fontes independentes que confirmem ou desmintam. Escreva um parágrafo relatando o que você conseguiu confirmar e o que continuou sem comprovação.',
     40),

    ('PUBLICITARIO',
     'Crie três caminhos para a mesma mensagem',
     'Escolha um produto ou causa e defina em uma frase o que precisa ser comunicado e para quem. Crie três conceitos bem diferentes de campanha para essa mesma mensagem, cada um com um título e uma imagem descrita em palavras. Mostre para cinco pessoas e pergunte qual funciona melhor e por quê.',
     45),

    ('DESIGNER_GRAFICO',
     'Reconstrua um cartaz ruim',
     'Encontre um cartaz ou aviso mal feito, daqueles difíceis de ler. Identifique o problema real: hierarquia, contraste, excesso de informação. Refaça a peça mantendo exatamente o mesmo conteúdo, mudando só a organização visual. Compare as duas versões lado a lado com outra pessoa.',
     40),

    ('PRODUTOR_AUDIOVISUAL',
     'Conte uma história em sessenta segundos',
     'Escolha uma história real e curta que valha ser contada. Faça o roteiro em cenas, planeje o que precisa gravar e produza um vídeo de no máximo um minuto com o celular. Edite cortando tudo que não for essencial. O aprendizado está no corte, não na gravação.',
     60)
) AS v (profession_code, title, instructions, estimated_minutes)
JOIN professions p ON p.code = v.profession_code;
