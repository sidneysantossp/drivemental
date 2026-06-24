(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }

  root.DriveAstralAreaApplicationKnowledge = factory().AreaApplicationKnowledge;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const CONTENT_VERSION = "area-application-knowledge-v0.1";

  const areaApplicationKnowledge = Object.freeze({
    general: Object.freeze({
      title: "Visão Geral",
      focusTerms: Object.freeze([
        "síntese",
        "prioridades",
        "momento atual",
        "equilíbrio",
        "próximo passo",
      ]),
      moonTranslations: Object.freeze({
        "Lua Magnética": "Na Visão Geral, a Lua Magnética destaca o início do ciclo e ajuda a reconhecer qual intenção pode organizar melhor o momento atual.",
        "Lua Lunar": "Na Visão Geral, a Lua Lunar coloca contrastes e desafios em evidência para que você diferencie urgência, necessidade e prioridade.",
        "Lua Elétrica": "Na Visão Geral, a Lua Elétrica favorece transformar percepção em participação prática, escolhendo onde sua energia pode ser útil agora.",
        "Lua Autoexistente": "Na Visão Geral, a Lua Autoexistente pede forma, método e limites claros para que uma intenção deixe de ser abstrata.",
        "Lua Harmônica": "Na Visão Geral, a Lua Harmônica chama atenção para os recursos, apoios e condições que sustentam o que está sendo construído.",
        "Lua Rítmica": "Na Visão Geral, a Lua Rítmica convida a reorganizar a rotina e distribuir melhor tempo, energia e responsabilidades.",
        "Lua Ressonante": "Na Visão Geral, a Lua Ressonante favorece uma pausa de escuta para alinhar ação, valores e direção.",
        "Lua Galáctica": "Na Visão Geral, a Lua Galáctica propõe observar se escolhas, palavras e hábitos estão coerentes entre si.",
        "Lua Solar": "Na Visão Geral, a Lua Solar destaca intenção e realização, ajudando a escolher qual objetivo merece presença consistente.",
        "Lua Planetária": "Na Visão Geral, a Lua Planetária favorece concluir, aperfeiçoar e tornar visível aquilo que já possui estrutura.",
        "Lua Espectral": "Na Visão Geral, a Lua Espectral ajuda a perceber o que pode ser liberado para reduzir peso e ampliar movimento.",
        "Lua Cristal": "Na Visão Geral, a Lua Cristal amplia a percepção sobre cooperação, partilha e participação em redes, sem limitar a leitura a uma única área da vida.",
        "Lua Cósmica": "Na Visão Geral, a Lua Cósmica favorece integrar aprendizados, reconhecer o percurso e preparar a passagem para um novo ciclo.",
      }),
      weekTranslations: Object.freeze({
        "Semana Vermelha": "A Semana Vermelha pede observação e coleta de informações antes de definir prioridades.",
        "Semana Branca": "A Semana Branca favorece refinar escolhas, retirar excessos e preparar o próximo movimento.",
        "Semana Azul": "A Semana Azul indica uma fase de execução: escolha uma mudança pequena, concreta e verificável.",
        "Semana Amarela": "A Semana Amarela destaca conclusão, partilha e reconhecimento do que já amadureceu.",
      }),
      plasmaTranslations: Object.freeze({
        Dali: "Dali, relacionado simbolicamente à Coroa, direciona a atenção para propósito, sentido e visão mais ampla.",
        Seli: "Seli, relacionado simbolicamente à Raiz, direciona a atenção para base, rotina e sustentação.",
        Gama: "Gama, relacionado simbolicamente ao Terceiro Olho, direciona a atenção para clareza, padrões e discernimento.",
        Kali: "Kali, relacionado simbolicamente ao Sacral, direciona a atenção para emoções, criatividade e adaptação.",
        Alfa: "Alfa, relacionado simbolicamente ao Laríngeo, direciona a atenção para expressão, escuta e coerência da fala.",
        Limi: "Limi, relacionado simbolicamente ao Plexo Solar, direciona a atenção para foco, iniciativa e uso consciente da energia.",
        Silio: "Silio, relacionado simbolicamente ao Cardíaco, direciona a atenção para cuidado, cooperação e limites.",
      }),
      navigationTranslation: "O Kin de navegação {navigationKin}, combinado ao tom {dailyTone} e ao selo {dailySeal} do dia, funciona como uma referência para reunir essas coordenadas e escolher um próximo passo consciente.",
      questions: Object.freeze([
        "Qual aspecto do momento atual precisa ser visto com mais clareza antes de qualquer decisão?",
        "O que pode ser simplificado para que sua energia se concentre no que realmente importa?",
        "Que pequeno movimento tornaria sua rotina mais coerente hoje?",
      ]),
      practices: Object.freeze({
        "Semana Vermelha": "Faça um mapa breve do momento atual: fatos, prioridades e uma questão que ainda precisa ser compreendida.",
        "Semana Branca": "Revise suas prioridades e retire uma tarefa, expectativa ou excesso que não precisa continuar hoje.",
        "Semana Azul": "Escolha uma ação pequena e conclua-a antes de iniciar outra.",
        "Semana Amarela": "Registre um aprendizado recente e compartilhe-o de forma simples com alguém de confiança.",
      }),
    }),
    purpose: Object.freeze({
      title: "Propósito e Direção",
      focusTerms: Object.freeze([
        "contribuição",
        "missão",
        "serviço",
        "sentido coletivo",
        "talentos",
      ]),
      moonTranslations: Object.freeze({
        "Lua Magnética": "Em Propósito e Direção, a Lua Magnética ajuda a reconhecer qual chamado, valor ou contribuição deseja orientar este novo ciclo.",
        "Lua Lunar": "Em Propósito e Direção, a Lua Lunar evidencia conflitos entre expectativas externas e caminhos que possuem sentido pessoal.",
        "Lua Elétrica": "Em Propósito e Direção, a Lua Elétrica transforma talentos em serviço ao perguntar onde sua contribuição pode ser útil de modo concreto.",
        "Lua Autoexistente": "Em Propósito e Direção, a Lua Autoexistente pede que uma vocação ganhe forma por meio de método, estudo, limites e etapas.",
        "Lua Harmônica": "Em Propósito e Direção, a Lua Harmônica favorece reunir conhecimentos, recursos e apoios para sustentar uma contribuição no tempo.",
        "Lua Rítmica": "Em Propósito e Direção, a Lua Rítmica convida a criar uma rotina que proteja tempo e energia para aquilo que possui significado.",
        "Lua Ressonante": "Em Propósito e Direção, a Lua Ressonante favorece escutar quais talentos e valores pedem expressão mais consciente.",
        "Lua Galáctica": "Em Propósito e Direção, a Lua Galáctica propõe verificar se sua atuação cotidiana está coerente com os valores que você afirma sustentar.",
        "Lua Solar": "Em Propósito e Direção, a Lua Solar ajuda a concentrar intenção em uma contribuição específica, evitando dispersão entre muitos caminhos.",
        "Lua Planetária": "Em Propósito e Direção, a Lua Planetária favorece materializar uma ideia de contribuição em projeto, entrega ou serviço concreto.",
        "Lua Espectral": "Em Propósito e Direção, a Lua Espectral convida a liberar papéis, metas ou expectativas que já não representam sua direção atual.",
        "Lua Cristal": "Em Propósito e Direção, a Lua Cristal destaca contribuição, missão e serviço: talentos podem ganhar mais sentido quando colocados a favor de algo maior e construído com outras pessoas.",
        "Lua Cósmica": "Em Propósito e Direção, a Lua Cósmica favorece integrar aprendizados do caminho e reconhecer como sua contribuição amadureceu ao longo do ciclo.",
      }),
      weekTranslations: Object.freeze({
        "Semana Vermelha": "A Semana Vermelha pede investigação: observe talentos, valores, necessidades do entorno e atividades que produzem sentido.",
        "Semana Branca": "A Semana Branca ajuda a separar chamado pessoal, cobrança externa e metas que perderam significado.",
        "Semana Azul": "A Semana Azul favorece testar uma ação concreta ligada à direção que você deseja desenvolver.",
        "Semana Amarela": "A Semana Amarela destaca contribuição e entrega: torne um aprendizado útil para outras pessoas.",
      }),
      plasmaTranslations: Object.freeze({
        Dali: "Com Dali e a Coroa, a investigação se volta para sentido, fé, visão de longo prazo e coerência com valores.",
        Seli: "Com Seli e a Raiz, a atenção vai para a base prática necessária para sustentar missão e contribuição.",
        Gama: "Com Gama e o Terceiro Olho, a atenção vai para discernir caminhos, padrões e prioridades de desenvolvimento.",
        Kali: "Com Kali e o Sacral, a atenção vai para criatividade, sensibilidade e talentos que pedem experimentação.",
        Alfa: "Com Alfa e o Laríngeo, a atenção vai para comunicar ideias, nomear talentos e expressar uma direção.",
        Limi: "Com Limi e o Plexo Solar, a atenção vai para iniciativa, disciplina e coragem de assumir uma contribuição.",
        Silio: "Com Silio e o Cardíaco, a atenção vai para serviço, cuidado e impacto humano da direção escolhida.",
      }),
      navigationTranslation: "No campo do propósito, o Kin de navegação {navigationKin}, junto do tom {dailyTone} e do selo {dailySeal}, sugere uma referência simbólica para transformar sentido em contribuição sem definir um destino fixo.",
      questions: Object.freeze([
        "Que talento pode ser colocado a serviço de algo maior de maneira concreta?",
        "Qual atividade aproxima você de contribuição e sentido, em vez de apenas cumprir expectativas?",
        "Que direção merece um experimento pequeno antes de uma decisão definitiva?",
      ]),
      practices: Object.freeze({
        "Semana Vermelha": "Liste atividades que geram sentido, talentos que você utiliza nelas e necessidades reais às quais eles podem servir.",
        "Semana Branca": "Escolha uma expectativa externa que precisa ser revista antes de definir seu próximo passo.",
        "Semana Azul": "Realize uma ação de até trinta minutos ligada a um talento ou contribuição que deseja desenvolver.",
        "Semana Amarela": "Compartilhe um conhecimento, apoio ou habilidade com alguém que possa se beneficiar dele.",
      }),
    }),
    "work-prosperity": Object.freeze({
      title: "Trabalho e Prosperidade",
      focusTerms: Object.freeze([
        "parcerias",
        "clientes",
        "rede de apoio",
        "colaboração produtiva",
        "recursos",
      ]),
      moonTranslations: Object.freeze({
        "Lua Magnética": "Em Trabalho e Prosperidade, a Lua Magnética ajuda a definir qual projeto, entrega ou objetivo material merece concentrar esforços neste ciclo.",
        "Lua Lunar": "Em Trabalho e Prosperidade, a Lua Lunar evidencia obstáculos, prioridades concorrentes e decisões materiais que precisam de critério.",
        "Lua Elétrica": "Em Trabalho e Prosperidade, a Lua Elétrica favorece colocar competências em serviço por meio de uma entrega útil e objetiva.",
        "Lua Autoexistente": "Em Trabalho e Prosperidade, a Lua Autoexistente pede estrutura: escopo, método, prazo, preço ou responsabilidade precisam ficar claros.",
        "Lua Harmônica": "Em Trabalho e Prosperidade, a Lua Harmônica chama atenção para orçamento, ferramentas, pessoas e recursos necessários para sustentar o trabalho.",
        "Lua Rítmica": "Em Trabalho e Prosperidade, a Lua Rítmica favorece organizar agenda, fluxo de tarefas e distribuição de responsabilidades.",
        "Lua Ressonante": "Em Trabalho e Prosperidade, a Lua Ressonante ajuda a escutar oportunidades e alinhar trabalho, competência e valor entregue.",
        "Lua Galáctica": "Em Trabalho e Prosperidade, a Lua Galáctica propõe revisar a coerência entre promessa, qualidade da entrega e prática profissional.",
        "Lua Solar": "Em Trabalho e Prosperidade, a Lua Solar concentra intenção em uma meta verificável e em ações que aproximem sua realização.",
        "Lua Planetária": "Em Trabalho e Prosperidade, a Lua Planetária favorece concluir, aperfeiçoar e apresentar uma entrega com estrutura.",
        "Lua Espectral": "Em Trabalho e Prosperidade, a Lua Espectral convida a liberar processos, custos ou tarefas que consomem energia sem gerar valor.",
        "Lua Cristal": "Em Trabalho e Prosperidade, a Lua Cristal destaca parcerias, clientes, rede de apoio e colaboração produtiva. Observe como recursos, responsabilidades e entregas podem ser organizados de forma compartilhada.",
        "Lua Cósmica": "Em Trabalho e Prosperidade, a Lua Cósmica favorece revisar resultados, incorporar aprendizados e preparar o próximo ciclo profissional.",
      }),
      weekTranslations: Object.freeze({
        "Semana Vermelha": "A Semana Vermelha pede levantamento de informações, números, necessidades de clientes e prioridades do projeto.",
        "Semana Branca": "A Semana Branca favorece refinar proposta, orçamento, prazos, acordos e distribuição de recursos.",
        "Semana Azul": "A Semana Azul pede execução: avance uma etapa objetiva da entrega e acompanhe o resultado.",
        "Semana Amarela": "A Semana Amarela destaca apresentação, entrega, divulgação e circulação do trabalho desenvolvido.",
      }),
      plasmaTranslations: Object.freeze({
        Dali: "Com Dali e a Coroa, observe se trabalho, prosperidade e propósito estão conectados por valores claros.",
        Seli: "Com Seli e a Raiz, a atenção vai para segurança material, caixa, rotina e base operacional.",
        Gama: "Com Gama e o Terceiro Olho, a atenção vai para planejamento, leitura de oportunidades e decisão baseada em dados.",
        Kali: "Com Kali e o Sacral, a atenção vai para criatividade, adaptação e soluções que melhorem a entrega.",
        Alfa: "Com Alfa e o Laríngeo, a atenção vai para comunicação profissional, negociação e clareza de proposta.",
        Limi: "Com Limi e o Plexo Solar, a atenção vai para foco, iniciativa, liderança e execução consistente.",
        Silio: "Com Silio e o Cardíaco, a atenção vai para confiança, cooperação, qualidade das parcerias e limites nas trocas profissionais.",
      }),
      navigationTranslation: "No campo profissional, o Kin de navegação {navigationKin}, junto do tom {dailyTone} e do selo {dailySeal}, funciona como referência simbólica para coordenar recursos, relações e uma entrega concreta.",
      questions: Object.freeze([
        "Qual parceria, cliente ou recurso precisa de um acordo mais claro para o trabalho avançar?",
        "Que etapa da entrega depende de colaboração produtiva, e não de esforço isolado?",
        "Onde organização de recursos pode gerar mais consistência do que simplesmente trabalhar mais?",
      ]),
      practices: Object.freeze({
        "Semana Vermelha": "Levante informações, números e prioridades antes de decidir; registre também quem pode contribuir com a próxima etapa.",
        "Semana Branca": "Revise uma proposta, prazo ou acordo e torne explícitos responsáveis, recursos e critérios de entrega.",
        "Semana Azul": "Conclua uma etapa verificável do projeto e comunique o avanço às pessoas envolvidas.",
        "Semana Amarela": "Apresente ou entregue o trabalho desenvolvido e registre o retorno recebido para o próximo ciclo.",
      }),
    }),
    "love-relationships": Object.freeze({
      title: "Amor e Relacionamentos",
      focusTerms: Object.freeze([
        "vínculos",
        "reciprocidade",
        "escuta",
        "limites",
        "convivência",
        "troca afetiva",
      ]),
      moonTranslations: Object.freeze({
        "Lua Magnética": "No campo dos relacionamentos, a Lua Magnética ajuda a reconhecer qual intenção deseja orientar seus vínculos e sua forma de estar com o outro.",
        "Lua Lunar": "No campo dos relacionamentos, a Lua Lunar evidencia diferenças, tensões e necessidades que pedem discernimento em vez de reação automática.",
        "Lua Elétrica": "No campo dos relacionamentos, a Lua Elétrica favorece transformar cuidado em presença, escuta e gesto concreto de reciprocidade.",
        "Lua Autoexistente": "No campo dos relacionamentos, a Lua Autoexistente pede forma para as trocas: acordos, limites e responsabilidades precisam ser compreensíveis.",
        "Lua Harmônica": "No campo dos relacionamentos, a Lua Harmônica convida a reconhecer quais recursos emocionais e práticos sustentam a convivência.",
        "Lua Rítmica": "No campo dos relacionamentos, a Lua Rítmica favorece equilibrar proximidade, autonomia, rotina e responsabilidades compartilhadas.",
        "Lua Ressonante": "No campo dos relacionamentos, a Lua Ressonante pede escuta cuidadosa para perceber o que está sendo dito e o que ainda não encontrou palavras.",
        "Lua Galáctica": "No campo dos relacionamentos, a Lua Galáctica propõe observar se atitudes, palavras e acordos estão coerentes.",
        "Lua Solar": "No campo dos relacionamentos, a Lua Solar ajuda a direcionar intenção para um vínculo ou conversa que merece presença real.",
        "Lua Planetária": "No campo dos relacionamentos, a Lua Planetária favorece transformar intenção afetiva em acordo, cuidado ou mudança concreta na convivência.",
        "Lua Espectral": "No campo dos relacionamentos, a Lua Espectral convida a liberar cobranças, controles ou padrões que impedem uma troca mais consciente.",
        "Lua Cristal": "No campo dos relacionamentos, a Lua Cristal convida a observar como você participa das trocas afetivas: se existe reciprocidade, se os acordos estão claros e se a convivência está sendo construída com presença, escuta e responsabilidade.",
        "Lua Cósmica": "No campo dos relacionamentos, a Lua Cósmica favorece integrar aprendizados de um vínculo e reconhecer o que pode seguir, mudar ou concluir com respeito.",
      }),
      weekTranslations: Object.freeze({
        "Semana Vermelha": "A Semana Vermelha pede observação: escute o contexto do vínculo e reconheça necessidades antes de responder.",
        "Semana Branca": "A Semana Branca pede refinamento: reveja palavras, acordos, limites e expectativas antes de agir ou cobrar algo do outro.",
        "Semana Azul": "A Semana Azul favorece uma conversa, escolha ou gesto coerente com o vínculo que você deseja construir.",
        "Semana Amarela": "A Semana Amarela destaca reconhecimento, cuidado, gratidão e partilha dos aprendizados da relação.",
      }),
      plasmaTranslations: Object.freeze({
        Dali: "Com Dali e a Coroa, observe quais valores e sentidos maiores orientam sua forma de amar e conviver.",
        Seli: "Com Seli ativando simbolicamente o chakra Raiz, a atenção vai para segurança emocional, estabilidade dos vínculos e base de confiança.",
        Gama: "Com Gama e o Terceiro Olho, a atenção vai para padrões relacionais, clareza e discernimento antes de interpretar o outro.",
        Kali: "Com Kali e o Sacral, a atenção vai para emoções, intimidade, desejo e capacidade de adaptação na convivência.",
        Alfa: "Com Alfa e o Laríngeo, a atenção vai para escuta, verdade, pedidos claros e comunicação sem agressão.",
        Limi: "Com Limi e o Plexo Solar, a atenção vai para iniciativa, autonomia e limites que preservam respeito mútuo.",
        Silio: "Com Silio e o Cardíaco, a atenção vai para cuidado, reciprocidade, compaixão e equilíbrio entre dar e receber.",
      }),
      navigationTranslation: "Nos vínculos, o Kin de navegação {navigationKin}, combinado ao tom {dailyTone} e ao selo {dailySeal}, oferece uma referência simbólica para escolher uma postura mais consciente na troca afetiva.",
      questions: Object.freeze([
        "Que padrão relacional está pedindo mais consciência, limite ou renovação?",
        "Onde preciso refinar minha forma de me comunicar antes de agir?",
        "Essa relação tem base, reciprocidade e presença?",
      ]),
      practices: Object.freeze({
        "Semana Vermelha": "Observe um vínculo importante e anote fatos, sentimentos e necessidades sem concluir antecipadamente o que o outro pensa.",
        "Semana Branca": "Antes de responder impulsivamente, faça uma pausa e pergunte: o que eu realmente quero comunicar?",
        "Semana Azul": "Realize uma conversa ou gesto concreto que expresse um limite, pedido ou cuidado com clareza.",
        "Semana Amarela": "Reconheça algo valioso em um vínculo e comunique esse reconhecimento sem transformar o gesto em cobrança.",
      }),
    }),
    "challenges-blocks": Object.freeze({
      title: "Desafios e Bloqueios",
      focusTerms: Object.freeze([
        "isolamento",
        "pedir ajuda",
        "colaboração",
        "controle",
        "confiança",
      ]),
      moonTranslations: Object.freeze({
        "Lua Magnética": "Em Desafios e Bloqueios, a Lua Magnética ajuda a identificar qual padrão merece atenção prioritária neste ciclo.",
        "Lua Lunar": "Em Desafios e Bloqueios, a Lua Lunar evidencia polarizações, conflitos internos e reações que mantêm uma repetição ativa.",
        "Lua Elétrica": "Em Desafios e Bloqueios, a Lua Elétrica favorece interromper a passividade por meio de um gesto pequeno, útil e possível.",
        "Lua Autoexistente": "Em Desafios e Bloqueios, a Lua Autoexistente pede que o problema seja definido com precisão para não se transformar em julgamento genérico.",
        "Lua Harmônica": "Em Desafios e Bloqueios, a Lua Harmônica convida a reconhecer recursos, apoio e condições que podem diminuir a sobrecarga.",
        "Lua Rítmica": "Em Desafios e Bloqueios, a Lua Rítmica ajuda a observar hábitos e rotinas que reforçam ou enfraquecem o padrão repetido.",
        "Lua Ressonante": "Em Desafios e Bloqueios, a Lua Ressonante favorece escutar sinais internos antes de repetir uma resposta automática.",
        "Lua Galáctica": "Em Desafios e Bloqueios, a Lua Galáctica propõe comparar valores declarados e comportamentos que continuam mantendo o ciclo.",
        "Lua Solar": "Em Desafios e Bloqueios, a Lua Solar concentra intenção em uma mudança específica, evitando tentar resolver tudo de uma vez.",
        "Lua Planetária": "Em Desafios e Bloqueios, a Lua Planetária favorece transformar compreensão em uma nova atitude observável.",
        "Lua Espectral": "Em Desafios e Bloqueios, a Lua Espectral destaca o que pode ser liberado: controle excessivo, culpa ou insistência em uma resposta que não funciona.",
        "Lua Cristal": "Em Desafios e Bloqueios, a Lua Cristal convida a investigar padrões de isolamento, dificuldade de pedir ajuda, resistência à colaboração, excesso de controle e dificuldade de confiar.",
        "Lua Cósmica": "Em Desafios e Bloqueios, a Lua Cósmica ajuda a integrar o aprendizado de um padrão sem transformá-lo em identidade permanente.",
      }),
      weekTranslations: Object.freeze({
        "Semana Vermelha": "A Semana Vermelha pede que você identifique fatos, gatilhos e contextos do padrão antes de julgá-lo.",
        "Semana Branca": "A Semana Branca favorece escolher o que precisa ser ajustado, mantido ou liberado.",
        "Semana Azul": "A Semana Azul pede uma resposta prática diferente daquela que costuma manter a repetição.",
        "Semana Amarela": "A Semana Amarela favorece registrar o aprendizado e aceitar apoio quando isso fizer sentido.",
      }),
      plasmaTranslations: Object.freeze({
        Dali: "Com Dali e a Coroa, observe crenças rígidas ou perda de sentido que podem estar ampliando o bloqueio.",
        Seli: "Com Seli e a Raiz, observe medo, insegurança e necessidade de controle sobre a base material ou emocional.",
        Gama: "Com Gama e o Terceiro Olho, observe interpretações repetidas e conclusões automáticas que reduzem a clareza.",
        Kali: "Com Kali e o Sacral, observe emoções evitadas, rigidez e dificuldade de adaptação.",
        Alfa: "Com Alfa e o Laríngeo, observe silêncios, falas defensivas ou dificuldade de pedir ajuda claramente.",
        Limi: "Com Limi e o Plexo Solar, observe excesso de esforço, reatividade e dificuldade de dividir responsabilidade.",
        Silio: "Com Silio e o Cardíaco, observe medo de confiar, isolamento e desequilíbrio entre cuidado e limite.",
      }),
      navigationTranslation: "Diante de um padrão repetido, o Kin de navegação {navigationKin}, junto do tom {dailyTone} e do selo {dailySeal}, funciona como referência para experimentar outra resposta sem produzir diagnóstico.",
      questions: Object.freeze([
        "Onde o excesso de controle está impedindo apoio, confiança ou colaboração?",
        "Que padrão de isolamento pode ser interrompido por um pedido de ajuda claro?",
        "Qual resposta automática precisa ser substituída por um gesto pequeno e diferente?",
      ]),
      practices: Object.freeze({
        "Semana Vermelha": "Registre uma situação recente usando três colunas: fato, reação automática e necessidade não atendida.",
        "Semana Branca": "Escolha um aspecto que você pode flexibilizar sem abandonar seus limites.",
        "Semana Azul": "Faça um pedido de ajuda específico ou teste uma resposta diferente em uma situação de baixo risco.",
        "Semana Amarela": "Anote o que mudou quando você dividiu responsabilidade, aceitou apoio ou soltou parte do controle.",
      }),
    }),
    "energy-spirituality": Object.freeze({
      title: "Energia e Espiritualidade",
      focusTerms: Object.freeze([
        "conexão com o campo",
        "prática coletiva",
        "presença",
        "silêncio",
        "escuta interior",
        "serviço espiritual",
      ]),
      moonTranslations: Object.freeze({
        "Lua Magnética": "Em Energia e Espiritualidade, a Lua Magnética ajuda a definir uma intenção simples para orientar presença e prática interior.",
        "Lua Lunar": "Em Energia e Espiritualidade, a Lua Lunar favorece discernir entre intuição, medo, expectativa e excesso de estímulo.",
        "Lua Elétrica": "Em Energia e Espiritualidade, a Lua Elétrica aproxima prática e serviço ao perguntar como presença interior pode se tornar cuidado concreto.",
        "Lua Autoexistente": "Em Energia e Espiritualidade, a Lua Autoexistente pede forma para a prática: horário, duração, método e limites sustentáveis.",
        "Lua Harmônica": "Em Energia e Espiritualidade, a Lua Harmônica chama atenção para os recursos e ambientes que ajudam a sustentar recolhimento e conexão.",
        "Lua Rítmica": "Em Energia e Espiritualidade, a Lua Rítmica favorece constância, equilíbrio e uma rotina espiritual que respeite corpo e cotidiano.",
        "Lua Ressonante": "Em Energia e Espiritualidade, a Lua Ressonante amplia silêncio, presença e escuta interior antes da ação.",
        "Lua Galáctica": "Em Energia e Espiritualidade, a Lua Galáctica propõe observar se prática, valores e comportamento cotidiano estão coerentes.",
        "Lua Solar": "Em Energia e Espiritualidade, a Lua Solar concentra intenção em uma qualidade de presença que você deseja sustentar.",
        "Lua Planetária": "Em Energia e Espiritualidade, a Lua Planetária favorece incorporar a prática em atitudes concretas de cuidado e serviço.",
        "Lua Espectral": "Em Energia e Espiritualidade, a Lua Espectral convida a liberar excessos, ruído e expectativas que afastam da presença.",
        "Lua Cristal": "Em Energia e Espiritualidade, a Lua Cristal destaca conexão com o campo, prática coletiva e serviço espiritual. Observe como silêncio, presença e escuta interior podem participar de uma construção compartilhada.",
        "Lua Cósmica": "Em Energia e Espiritualidade, a Lua Cósmica favorece integrar aprendizados da prática e permanecer presente na transição entre ciclos.",
      }),
      weekTranslations: Object.freeze({
        "Semana Vermelha": "A Semana Vermelha pede observação do ritmo interno e das práticas que realmente favorecem centramento.",
        "Semana Branca": "A Semana Branca ajuda a reduzir excessos e preparar um espaço simples de silêncio e recolhimento.",
        "Semana Azul": "A Semana Azul favorece realizar uma prática breve com presença e intenção clara.",
        "Semana Amarela": "A Semana Amarela destaca integração, cuidado, partilha e serviço sem imposição.",
      }),
      plasmaTranslations: Object.freeze({
        Dali: "Com Dali e a Coroa, a atenção vai para sentido, contemplação, fé e visão ampla.",
        Seli: "Com Seli e a Raiz, a atenção vai para aterramento, corpo, rotina e segurança antes de qualquer expansão.",
        Gama: "Com Gama e o Terceiro Olho, a atenção vai para discernimento, silêncio mental e observação de padrões.",
        Kali: "Com Kali e o Sacral, a atenção vai para sensibilidade, emoções e criatividade como vias de percepção.",
        Alfa: "Com Alfa e o Laríngeo, a atenção vai para palavra consciente, oração, escuta e expressão verdadeira.",
        Limi: "Com Limi e o Plexo Solar, a atenção vai para disciplina, foco e uso equilibrado da energia.",
        Silio: "Com Silio e o Cardíaco, a atenção vai para compaixão, gratidão, cuidado e serviço espiritual.",
      }),
      navigationTranslation: "Na prática interior, o Kin de navegação {navigationKin}, combinado ao tom {dailyTone} e ao selo {dailySeal}, oferece uma referência simbólica para integrar presença, escuta e serviço sem medir seu estado espiritual.",
      questions: Object.freeze([
        "Que prática simples favorece presença e escuta interior sem afastar você da vida cotidiana?",
        "Como silêncio e serviço podem se apoiar mutuamente neste momento?",
        "Onde uma prática coletiva pode fortalecer conexão sem substituir seu discernimento pessoal?",
      ]),
      practices: Object.freeze({
        "Semana Vermelha": "Observe por alguns minutos seu ritmo, sua respiração e quais ambientes favorecem presença.",
        "Semana Branca": "Reduza estímulos por cinco minutos e prepare um espaço simples para silêncio ou oração.",
        "Semana Azul": "Realize uma prática breve de respiração, contemplação ou escrita com uma intenção clara.",
        "Semana Amarela": "Transforme o aprendizado da prática em um gesto discreto de cuidado ou serviço.",
      }),
    }),
    "decisions-cycles": Object.freeze({
      title: "Decisões e Ciclos",
      focusTerms: Object.freeze([
        "outras pessoas",
        "cooperação",
        "alinhamento",
        "impactos coletivos",
        "próximo movimento",
      ]),
      moonTranslations: Object.freeze({
        "Lua Magnética": "Em Decisões e Ciclos, a Lua Magnética ajuda a definir qual escolha ou transição merece atenção prioritária.",
        "Lua Lunar": "Em Decisões e Ciclos, a Lua Lunar evidencia alternativas, tensões e critérios que precisam ser comparados.",
        "Lua Elétrica": "Em Decisões e Ciclos, a Lua Elétrica favorece reconhecer quem será afetado e qual contribuição cada pessoa pode oferecer.",
        "Lua Autoexistente": "Em Decisões e Ciclos, a Lua Autoexistente pede critérios, limites e etapas claras antes de assumir uma direção.",
        "Lua Harmônica": "Em Decisões e Ciclos, a Lua Harmônica chama atenção para recursos, apoios e condições necessárias para sustentar a escolha.",
        "Lua Rítmica": "Em Decisões e Ciclos, a Lua Rítmica favorece organizar o tempo da transição e distribuir responsabilidades.",
        "Lua Ressonante": "Em Decisões e Ciclos, a Lua Ressonante pede escuta e alinhamento antes de transformar impulso em movimento.",
        "Lua Galáctica": "Em Decisões e Ciclos, a Lua Galáctica propõe verificar se a escolha é coerente com valores, acordos e consequências.",
        "Lua Solar": "Em Decisões e Ciclos, a Lua Solar ajuda a concentrar intenção na decisão que realmente precisa ser tomada.",
        "Lua Planetária": "Em Decisões e Ciclos, a Lua Planetária favorece formalizar a escolha e executar a próxima etapa concreta.",
        "Lua Espectral": "Em Decisões e Ciclos, a Lua Espectral convida a liberar opções, controles ou etapas que já cumpriram sua função.",
        "Lua Cristal": "Em Decisões e Ciclos, a Lua Cristal destaca decisões que envolvem outras pessoas, escolhas que precisam de cooperação e alinhamento antes de agir. Avalie também os impactos coletivos do próximo movimento.",
        "Lua Cósmica": "Em Decisões e Ciclos, a Lua Cósmica favorece integrar aprendizados, concluir uma etapa e preparar a passagem seguinte.",
      }),
      weekTranslations: Object.freeze({
        "Semana Vermelha": "A Semana Vermelha pede reunir fatos, ouvir pessoas envolvidas e reconhecer a etapa real do ciclo.",
        "Semana Branca": "A Semana Branca favorece comparar opções, custos, limites, acordos e impactos.",
        "Semana Azul": "A Semana Azul pede um próximo movimento verificável, sem tentar controlar todo o resultado.",
        "Semana Amarela": "A Semana Amarela destaca comunicação da decisão, conclusão da etapa e distribuição dos aprendizados.",
      }),
      plasmaTranslations: Object.freeze({
        Dali: "Com Dali e a Coroa, observe se a decisão permanece conectada a valores e sentido de longo prazo.",
        Seli: "Com Seli e a Raiz, observe segurança, base prática e sustentação da escolha.",
        Gama: "Com Gama e o Terceiro Olho, observe cenários, padrões, consequências e informações ainda ausentes.",
        Kali: "Com Kali e o Sacral, observe emoções, flexibilidade e capacidade de adaptação à mudança.",
        Alfa: "Com Alfa e o Laríngeo, observe conversas, acordos e informações que precisam ser comunicados.",
        Limi: "Com Limi e o Plexo Solar, observe iniciativa, responsabilidade e energia disponível para executar.",
        Silio: "Com Silio e o Cardíaco, observe impactos humanos, cooperação e limites das pessoas envolvidas.",
      }),
      navigationTranslation: "Para a decisão atual, o Kin de navegação {navigationKin}, junto do tom {dailyTone} e do selo {dailySeal}, oferece uma referência simbólica para alinhar pessoas, critérios e próximo movimento sem antecipar o resultado.",
      questions: Object.freeze([
        "Quem será afetado por esta escolha e qual alinhamento precisa acontecer antes de agir?",
        "Que impacto coletivo ainda não foi considerado com a atenção necessária?",
        "Qual próximo movimento pode ser realizado sem tentar controlar todo o resultado?",
      ]),
      practices: Object.freeze({
        "Semana Vermelha": "Liste fatos, pessoas envolvidas e informações que ainda precisam ser ouvidas antes da decisão.",
        "Semana Branca": "Compare duas opções considerando custos, limites, acordos e impactos coletivos.",
        "Semana Azul": "Execute apenas a próxima etapa verificável e defina quando o resultado será revisto.",
        "Semana Amarela": "Comunique a decisão com clareza, registre responsabilidades e conclua o que já pode ser encerrado.",
      }),
    }),
  });

  function fillTemplate(template, values) {
    return String(template || "").replace(/\{([a-zA-Z]+)\}/g, (_match, key) => (
      String(values[key] || "")
    ));
  }

  function coordinateNumber(value) {
    return Number.isInteger(value) ? value : 0;
  }

  function selectQuestion(area, moonNumber, weekNumber, plasmaNumber) {
    const index = (
      coordinateNumber(moonNumber)
      + coordinateNumber(weekNumber)
      + coordinateNumber(plasmaNumber)
    ) % area.questions.length;
    return area.questions[index];
  }

  function buildApplication(input) {
    const area = areaApplicationKnowledge[input && input.areaId]
      || areaApplicationKnowledge.general;
    const moonName = String(input && input.moonName || "");
    const weekName = String(input && input.weekName || "");
    const plasmaName = String(input && input.plasmaName || "");
    const chakraName = String(input && input.chakraName || "chakra não disponível");
    const moonText = area.moonTranslations[moonName]
      || `Em ${area.title}, a ${moonName || "Lua atual"} oferece um ponto de observação ligado a ${area.focusTerms.slice(0, 3).join(", ")}.`;
    const weekText = area.weekTranslations[weekName]
      || `A ${weekName || "semana atual"} ajuda a transformar essa leitura em uma ação coerente com a área escolhida.`;
    const plasmaText = area.plasmaTranslations[plasmaName]
      || `O plasma ${plasmaName || "atual"}, associado simbolicamente a ${chakraName}, direciona a atenção para a forma como essa área está sendo vivida.`;
    const navigationText = fillTemplate(area.navigationTranslation, {
      navigationKin: input && input.navigationKin,
      dailyTone: input && input.dailyTone || "não disponível",
      dailySeal: input && input.dailySeal || "não disponível",
    });

    return {
      areaId: input && input.areaId,
      areaTitle: area.title,
      focusTerms: [...area.focusTerms],
      moonTranslation: moonText,
      weekTranslation: weekText,
      plasmaTranslation: plasmaText,
      navigationTranslation: navigationText,
      applicationSummary: [moonText, weekText, plasmaText, navigationText].join(" "),
      reflectionQuestion: selectQuestion(
        area,
        input && input.moonNumber,
        input && input.weekNumber,
        input && input.plasmaNumber,
      ),
      dailyPractice: area.practices[weekName]
        || `Escolha uma ação breve relacionada a ${area.focusTerms.slice(0, 2).join(" e ")}.`,
      contentVersion: CONTENT_VERSION,
    };
  }

  return {
    AreaApplicationKnowledge: {
      areaApplicationKnowledge,
      buildApplication,
      constants: {
        CONTENT_VERSION,
      },
    },
  };
});
