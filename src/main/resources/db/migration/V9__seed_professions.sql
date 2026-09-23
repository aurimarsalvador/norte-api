-- Profissoes referenciadas pela area via code, nao por id numerico.
INSERT INTO professions (career_area_id, code, name, summary, description, typical_activities, education_path)
SELECT area.id, p.code, p.name, p.summary, p.description, p.typical_activities, p.education_path
FROM (
    VALUES
    -- Tecnologia e Computacao
    ('TECNOLOGIA', 'DESENVOLVEDOR_SOFTWARE', 'Pessoa Desenvolvedora de Software',
     'Escreve e mantém os programas que fazem sites, aplicativos e sistemas funcionarem.',
     'Traduz uma necessidade real em código que funciona e continua funcionando depois de pronto. O trabalho é menos digitar rápido e mais entender o problema, decidir entre caminhos possíveis e lidar com o que quebra. Boa parte do dia é leitura de código alheio, conversa com o time e depuração.',
     'Levantar requisitos com quem vai usar o sistema; escrever e revisar código; investigar defeitos relatados; escrever testes automatizados; participar de revisões de código; publicar novas versões.',
     'Graduação em Ciência da Computação, Engenharia de Software, Sistemas de Informação ou tecnólogo em Análise e Desenvolvimento de Sistemas (2 a 5 anos). Há entrada por cursos técnicos e formação autodidata com portfólio.'),

    ('TECNOLOGIA', 'CIENTISTA_DADOS', 'Cientista de Dados',
     'Transforma grandes volumes de dados em respostas que orientam decisões.',
     'Parte de uma pergunta de negócio, busca os dados que podem respondê-la, limpa o que está inconsistente e constrói modelos estatísticos. O resultado só vale se for explicado de forma compreensível para quem vai decidir, o que faz da comunicação parte do trabalho técnico.',
     'Formular hipóteses; extrair e limpar bases de dados; treinar e avaliar modelos; construir painéis e relatórios; apresentar conclusões e suas limitações.',
     'Graduação em Estatística, Ciência da Computação, Matemática, Engenharia ou áreas afins (4 a 5 anos), normalmente com especialização em ciência de dados ou aprendizado de máquina.'),

    ('TECNOLOGIA', 'ANALISTA_CIBERSEGURANCA', 'Analista de Cibersegurança',
     'Protege sistemas e dados contra invasões, vazamentos e fraudes.',
     'Trabalha na defesa: mapeia onde um sistema é frágil, acompanha sinais de comportamento suspeito e reage quando algo acontece. Exige disciplina para documentar tudo e paciência para investigar pistas que quase sempre não dão em nada — até a que dá.',
     'Monitorar alertas de segurança; testar sistemas em busca de vulnerabilidades; responder a incidentes; escrever políticas de acesso; treinar outras equipes em boas práticas.',
     'Graduação em Ciência da Computação, Redes, Sistemas de Informação ou tecnólogo em Segurança da Informação (2 a 5 anos), reforçada por certificações técnicas da área.'),

    ('TECNOLOGIA', 'DESIGNER_UX', 'Designer de Experiência (UX/UI)',
     'Desenha como as pessoas usam um produto digital, do fluxo à tela final.',
     'Fica entre quem usa e quem constrói. Conversa com usuários reais, descobre onde eles travam, propõe fluxos mais simples e desenha as telas. A parte visual é a ponta: o centro do trabalho é entender gente e testar se a solução proposta realmente ajudou.',
     'Entrevistar usuários; mapear jornadas; prototipar telas; rodar testes de usabilidade; manter o sistema de design junto ao time de desenvolvimento.',
     'Graduação em Design, Design Digital, Publicidade ou tecnólogo em UX (2 a 4 anos). Portfólio com casos reais costuma pesar tanto quanto o diploma.'),

    ('TECNOLOGIA', 'ANALISTA_REDES', 'Analista de Redes e Infraestrutura',
     'Mantém de pé os servidores, redes e serviços que todo o resto usa.',
     'É quem garante que a estrutura invisível funcione: conexão, servidores, backups, disponibilidade. Quando tudo vai bem ninguém percebe o trabalho; quando cai, é a primeira pessoa chamada. Combina método, documentação e sangue-frio sob pressão.',
     'Configurar servidores e redes; monitorar disponibilidade e desempenho; planejar e testar backups; atender incidentes de indisponibilidade; documentar a infraestrutura.',
     'Tecnólogo em Redes de Computadores ou graduação em Sistemas de Informação (2 a 4 anos), normalmente com certificações de fabricantes e de nuvem.'),

    -- Saude e Bem-estar
    ('SAUDE', 'MEDICO', 'Médico(a)',
     'Investiga, diagnostica e trata problemas de saúde, acompanhando o paciente ao longo do tratamento.',
     'O raciocínio clínico é parecido com o de uma investigação: sintomas são pistas, exames são evidências e o diagnóstico é a hipótese que melhor explica o conjunto. Junto com isso vem a parte humana, de comunicar notícias difíceis e sustentar decisões com informação incompleta.',
     'Realizar consultas e exame clínico; pedir e interpretar exames; prescrever tratamentos; acompanhar a evolução do paciente; atuar em plantões e emergências.',
     'Graduação em Medicina (6 anos) seguida de residência médica na especialidade escolhida (2 a 5 anos). É uma das formações mais longas do país.'),

    ('SAUDE', 'ENFERMEIRO', 'Enfermeiro(a)',
     'Coordena e executa o cuidado direto ao paciente, do procedimento à organização da equipe.',
     'Está mais perto do paciente do que qualquer outro profissional da saúde, e por isso costuma ser quem percebe primeiro que algo mudou. Também coordena técnicos de enfermagem, controla medicações e sustenta a rotina de uma unidade inteira.',
     'Avaliar e monitorar pacientes; administrar medicações; realizar curativos e procedimentos; coordenar a equipe de enfermagem; registrar a evolução do cuidado.',
     'Graduação em Enfermagem (4 a 5 anos), com possibilidade de especialização em áreas como UTI, obstetrícia ou saúde pública.'),

    ('SAUDE', 'PSICOLOGO', 'Psicólogo(a)',
     'Acompanha pessoas no cuidado com a saúde mental, em consultório, escola, empresa ou serviço público.',
     'O instrumento principal é a escuta treinada: perceber o que é dito, o que não é, e devolver isso de um jeito que ajude a pessoa a se enxergar. Exige preparo emocional para sustentar histórias difíceis sem levá-las para casa.',
     'Conduzir atendimentos individuais ou em grupo; aplicar e interpretar avaliações; construir planos terapêuticos; atuar em equipes multiprofissionais; supervisionar casos.',
     'Graduação em Psicologia (5 anos) com estágio supervisionado obrigatório; para a prática clínica, formação continuada em uma abordagem terapêutica.'),

    ('SAUDE', 'FISIOTERAPEUTA', 'Fisioterapeuta',
     'Recupera e preserva o movimento do corpo depois de lesões, cirurgias ou doenças.',
     'Trabalho de contato direto: avalia com as mãos, monta um plano de exercícios e acompanha uma evolução que costuma ser lenta. Grande parte do resultado vem de manter o paciente motivado sessão após sessão.',
     'Avaliar amplitude de movimento e força; montar planos de reabilitação; conduzir sessões de exercício e terapia manual; orientar exercícios domiciliares; registrar a evolução.',
     'Graduação em Fisioterapia (4 a 5 anos), com especializações comuns em ortopedia, neurologia, esporte ou respiratória.'),

    ('SAUDE', 'NUTRICIONISTA', 'Nutricionista',
     'Orienta a alimentação de pessoas e instituições com base em evidência científica.',
     'Traduz bioquímica e fisiologia em algo que cabe na rotina, no orçamento e na cultura de quem vai comer. O desafio raramente é saber o que seria ideal: é construir um plano que a pessoa consiga sustentar.',
     'Avaliar estado nutricional; prescrever planos alimentares; acompanhar resultados; planejar cardápios institucionais; orientar grupos e campanhas de educação alimentar.',
     'Graduação em Nutrição (4 anos), com especializações em clínica, esportiva, saúde pública ou alimentação coletiva.'),

    -- Negocios e Gestao
    ('NEGOCIOS', 'ADMINISTRADOR', 'Administrador(a)',
     'Organiza pessoas, processos e recursos para que a organização entregue o que promete.',
     'É a profissão de enxergar a organização inteira: onde o dinheiro entra, onde vaza, quem faz o quê e o que trava. O trabalho alterna entre planejar com calma e resolver o que pegou fogo hoje.',
     'Planejar metas e orçamentos; acompanhar indicadores; coordenar equipes; melhorar processos; negociar com fornecedores e parceiros.',
     'Graduação em Administração (4 anos); pós-graduação em gestão, finanças ou projetos é comum para cargos de coordenação.'),

    ('NEGOCIOS', 'CONTADOR', 'Contador(a)',
     'Registra, apura e interpreta a vida financeira de uma organização, com responsabilidade legal sobre isso.',
     'Muito além de lançar notas: é quem garante que a empresa esteja em dia com a lei e quem consegue dizer, com números, se ela está saudável. Um erro pequeno vira multa grande, o que torna a precisão parte inegociável do ofício.',
     'Classificar e conciliar lançamentos; apurar impostos; fechar balanços e demonstrações; atender fiscalizações; orientar decisões com base em custos e resultados.',
     'Graduação em Ciências Contábeis (4 anos) e registro no Conselho Regional de Contabilidade, obtido por exame de suficiência.'),

    ('NEGOCIOS', 'ANALISTA_MARKETING', 'Analista de Marketing',
     'Estuda o público e constrói as campanhas que aproximam um produto das pessoas certas.',
     'Une duas metades que parecem opostas: criar mensagens que emocionam e medir friamente se elas funcionaram. Quem gosta só da primeira parte costuma se frustrar; quem gosta das duas encontra um campo bem largo.',
     'Pesquisar público e concorrência; planejar campanhas; produzir conteúdo com o time criativo; acompanhar métricas de desempenho; ajustar o que não converteu.',
     'Graduação em Marketing, Publicidade e Propaganda ou Administração (4 anos), com especializações em marketing digital e análise de dados.'),

    ('NEGOCIOS', 'EMPREENDEDOR', 'Empreendedor(a) e Gestor(a) de Negócio Próprio',
     'Cria e conduz um negócio próprio, da ideia inicial à operação que se sustenta.',
     'Acumula todos os papéis no começo: vende, atende, controla o caixa e limpa a loja. A liberdade é real, a instabilidade também. Costuma exigir tolerância alta a risco e capacidade de continuar depois de tentativas que não deram certo.',
     'Testar a ideia com clientes reais; montar a operação; cuidar do fluxo de caixa; contratar e formar equipe; ajustar o produto conforme o mercado responde.',
     'Não há formação obrigatória. Cursos de gestão, finanças e vendas (técnicos, superiores ou de curta duração) reduzem bastante o custo do aprendizado por tentativa e erro.'),

    -- Engenharias e Ciencias
    ('EXATAS_ENGENHARIA', 'ENGENHEIRO_CIVIL', 'Engenheiro(a) Civil',
     'Projeta e acompanha a construção de edifícios, estradas e obras de infraestrutura.',
     'Divide o tempo entre o escritório, onde calcula e desenha, e o canteiro, onde a realidade sempre difere do projeto. Responde tecnicamente pela segurança do que foi construído, o que dá peso a cada decisão de cálculo.',
     'Elaborar e revisar projetos estruturais; calcular cargas e materiais; orçar obras; fiscalizar a execução; garantir normas de segurança.',
     'Graduação em Engenharia Civil (5 anos) e registro no CREA. Especializações comuns em estruturas, geotecnia e gestão de obras.'),

    ('EXATAS_ENGENHARIA', 'ENGENHEIRO_MECANICO', 'Engenheiro(a) Mecânico(a)',
     'Projeta, testa e mantém máquinas, motores e sistemas de produção.',
     'Para quem sempre quis abrir o aparelho para ver o que tem dentro. Junta física aplicada, desenho técnico e muita prática de oficina: o projeto só está certo quando a peça roda no mundo real.',
     'Desenhar componentes e sistemas; simular esforços e desgaste; acompanhar protótipos; planejar manutenção; otimizar linhas de produção.',
     'Graduação em Engenharia Mecânica (5 anos) e registro no CREA, com especializações em automação, materiais ou energia.'),

    ('EXATAS_ENGENHARIA', 'ENGENHEIRO_ELETRICO', 'Engenheiro(a) Eletricista',
     'Projeta sistemas elétricos e eletrônicos, da rede de uma cidade ao circuito de um equipamento.',
     'Trabalha com algo invisível e perigoso, o que torna precisão e norma técnica parte do dia. Vai do cálculo de uma instalação predial ao projeto de eletrônica embarcada, dependendo da especialidade.',
     'Dimensionar instalações e circuitos; especificar equipamentos; testar e comissionar sistemas; analisar consumo e eficiência; garantir conformidade com normas.',
     'Graduação em Engenharia Elétrica ou Eletrônica (5 anos) e registro no CREA, com ramificações em potência, eletrônica ou controle.'),

    ('EXATAS_ENGENHARIA', 'ARQUITETO', 'Arquiteto(a) e Urbanista',
     'Projeta espaços onde as pessoas vivem, trabalham e circulam, do interior de uma casa ao bairro.',
     'Fica no encontro entre arte e técnica: a ideia precisa ser bonita, funcional, viável no orçamento e legal perante o código de obras. Quem gosta só de desenhar tende a estranhar a quantidade de norma envolvida.',
     'Levantar necessidades do cliente; desenvolver estudos e projetos executivos; compatibilizar com engenharias; acompanhar a obra; adequar o projeto à legislação urbana.',
     'Graduação em Arquitetura e Urbanismo (5 anos) e registro no CAU, com especializações em interiores, urbanismo ou patrimônio.'),

    ('EXATAS_ENGENHARIA', 'BIOLOGO', 'Biólogo(a)',
     'Estuda os seres vivos e suas relações, em laboratório, em campo ou na conservação ambiental.',
     'A rotina real é menos documentário e mais método: coleta paciente, registro meticuloso e resultados que demoram. Quem gosta de perguntas abertas e não se incomoda com repetição encontra aqui um campo vasto.',
     'Coletar e analisar amostras; conduzir experimentos; identificar e catalogar espécies; elaborar laudos e relatórios técnicos; participar de projetos de conservação.',
     'Graduação em Ciências Biológicas (4 anos, licenciatura ou bacharelado) e registro no CRBio; a carreira de pesquisa costuma exigir mestrado e doutorado.'),

    -- Humanas, Educacao e Impacto Social
    ('HUMANAS_SOCIAL', 'PROFESSOR', 'Professor(a) da Educação Básica',
     'Ensina, avalia e acompanha o desenvolvimento de crianças e adolescentes.',
     'Ensinar é traduzir: pegar um conteúdo que você domina e reconstruí-lo no repertório de quem ainda não o domina, trinta vezes diferentes na mesma sala. Exige preparo de conteúdo, manejo de turma e resistência emocional.',
     'Planejar aulas e sequências didáticas; conduzir turmas; elaborar e corrigir avaliações; acompanhar alunos com dificuldade; dialogar com famílias e coordenação.',
     'Licenciatura na área escolhida (4 anos). Concursos públicos são a principal porta de entrada para a rede estadual e municipal.'),

    ('HUMANAS_SOCIAL', 'ADVOGADO', 'Advogado(a)',
     'Defende interesses e direitos, orientando pessoas e organizações diante da lei.',
     'Muito mais escrita e leitura do que discurso em tribunal. O trabalho é construir um argumento sólido a partir de leis, precedentes e fatos, e sustentá-lo quando alguém igualmente preparado tenta derrubá-lo.',
     'Analisar casos e documentos; pesquisar legislação e jurisprudência; redigir petições e contratos; orientar clientes; representar partes em audiências.',
     'Graduação em Direito (5 anos) e aprovação no Exame de Ordem da OAB para exercer a advocacia.'),

    ('HUMANAS_SOCIAL', 'ASSISTENTE_SOCIAL', 'Assistente Social',
     'Atua junto a pessoas em situação de vulnerabilidade, garantindo acesso a direitos e políticas públicas.',
     'Fica na linha de frente de problemas que não se resolvem sozinhos: moradia, violência, renda, acesso à saúde. Exige conhecimento técnico da rede de serviços e firmeza para não confundir acolhimento com assistencialismo.',
     'Realizar atendimentos e visitas; elaborar estudos sociais e pareceres; articular a rede de serviços; acompanhar famílias; participar da construção de políticas públicas.',
     'Graduação em Serviço Social (4 anos) e registro no CRESS; grande parte das vagas está em prefeituras e no sistema público de saúde e assistência.'),

    ('HUMANAS_SOCIAL', 'GESTOR_PUBLICO', 'Gestor(a) Público(a)',
     'Planeja e administra serviços e projetos do Estado, do orçamento à execução.',
     'Trabalha com recursos coletivos e regras rígidas: cada decisão precisa ser justificável e auditável. A recompensa é a escala, porque uma política bem desenhada alcança milhares de pessoas de uma vez.',
     'Elaborar e acompanhar orçamentos; desenhar programas e políticas; conduzir processos de licitação; monitorar indicadores; prestar contas aos órgãos de controle.',
     'Graduação em Administração Pública, Gestão de Políticas Públicas, Administração ou Direito (4 anos). O ingresso costuma se dar por concurso público.'),

    -- Comunicacao e Artes
    ('CRIATIVA', 'JORNALISTA', 'Jornalista',
     'Apura, verifica e conta histórias de interesse público com responsabilidade sobre a informação.',
     'A parte central não é escrever bonito, é checar. Encontrar fonte, confrontar versões, descartar o que não se sustenta e só então narrar. Trabalha com prazo curto e com o peso de que um erro publicado vira dano real.',
     'Apurar pautas e entrevistar fontes; checar informações e documentos; redigir e editar reportagens; produzir conteúdo em vídeo e áudio; acompanhar repercussão.',
     'Graduação em Jornalismo (4 anos). A experiência em veículos, laboratórios de redação e projetos próprios pesa muito na entrada no mercado.'),

    ('CRIATIVA', 'PUBLICITARIO', 'Publicitário(a)',
     'Cria campanhas que conectam marcas e pessoas, do conceito à peça final.',
     'Começa com um problema de comunicação e termina em ideia: qual mensagem, para quem, em que canal. É trabalho de equipe e de prazo, com muita ideia descartada antes de uma sobreviver à aprovação do cliente.',
     'Interpretar briefings; desenvolver conceitos criativos; redigir textos publicitários; acompanhar produção de peças; avaliar o desempenho das campanhas.',
     'Graduação em Publicidade e Propaganda (4 anos), com portfólio de campanhas como principal cartão de entrada.'),

    ('CRIATIVA', 'DESIGNER_GRAFICO', 'Designer Gráfico',
     'Resolve problemas de comunicação por meio de imagem, tipografia e composição.',
     'Design não é decorar: é hierarquizar informação para que a mensagem chegue. O gosto pessoal cede lugar ao objetivo da peça, e boa parte do ofício está em repetir ajustes milimétricos até o resultado ficar limpo.',
     'Criar identidades visuais e peças gráficas; definir tipografia e paleta; preparar arquivos para impressão e web; manter manuais de marca; revisar aplicações.',
     'Graduação em Design Gráfico ou tecnólogo em Design (2 a 4 anos), com portfólio como principal instrumento de avaliação.'),

    ('CRIATIVA', 'PRODUTOR_AUDIOVISUAL', 'Produtor(a) Audiovisual',
     'Planeja e realiza vídeos, filmes e conteúdos audiovisuais, do roteiro à entrega.',
     'É criação e logística na mesma pessoa: a ideia só existe se houver equipe, equipamento, locação e cronograma. Quem gosta de coordenar caos com prazo curto costuma se encontrar aqui.',
     'Desenvolver roteiros e planos de gravação; organizar equipe e equipamentos; dirigir ou assistir a direção; acompanhar edição e finalização; entregar nos formatos de cada canal.',
     'Graduação em Cinema, Audiovisual, Rádio e TV ou tecnólogo da área (2 a 4 anos). Muita gente entra por prática em produtoras e projetos independentes.')
) AS p (area_code, code, name, summary, description, typical_activities, education_path)
JOIN career_areas area ON area.code = p.area_code;
