# Auditoria tecnica do Drive Astral

Nota de continuidade: esta auditoria descreve o estado inicial encontrado no prototipo. A implementacao posterior do motor, da base de conhecimento e da experiencia gratuita esta documentada em `../implementacao-sincronario/01-motor-v0.1.md`.

## Estado atual

O Drive Astral atual e um prototipo mobile-first estatico, executado no navegador por um servidor local Node.js simples. A aplicacao possui forte acabamento visual, navegacao entre telas e persistencia basica em `localStorage`, mas ainda nao possui motor matematico do Sincronario das 13 Luas.

## Principais descobertas

- Nao existe calculo de Kin pessoal, Kin do dia, selo, tom, cor, assinatura galactica, Oraculo do Destino, Onda Encantada, Castelo, Harmonica ou Familia Terrestre.
- A data de nascimento e coletada, salva e exibida no perfil, mas nao participa de nenhum calculo.
- O mapa dos chakras e visual e estatico. Ele nao calcula estado, bloqueio, hiperatividade, prioridade ou diagnostico individual.
- O protocolo diario e um conjunto fixo de textos. Ele nao muda por Kin, data, historico ou tema escolhido.
- O historico e salvo no navegador e recebe um resumo textual generico no envio do formulario.
- Nao ha chamadas de inteligencia artificial no projeto atual.
- Nao ha banco de dados, autenticacao, checkout, assinatura, API de negocio ou camada de privacidade.

## Riscos criticos

1. O produto ainda nao tem fundamento deterministico para sustentar confianca no Sincronario.
2. Textos atuais podem ser percebidos como interpretacoes personalizadas, embora sejam fixos ou genericos.
3. Nao existe separacao entre calculo, interpretacao, interface e historico.
4. Dados pessoais sao salvos em `localStorage` sem consentimento, politica de privacidade ou exclusao pelo usuario.
5. Nao ha testes automatizados para regras centrais, pois o motor ainda nao existe.

## Decisoes necessarias

- Qual metodo oficial do Sincronario das 13 Luas sera usado como fonte do motor.
- Quais campos dependem de data, horario e fuso.
- Quais conteudos interpretativos serao criados, revisados e versionados.
- Como comunicar ao usuario a diferenca entre calculado, interpretado, informado e inferido.
- Quando o app deixara de ser prototipo local e passara a ter backend, autenticao, LGPD e pagamento.

## Ordem recomendada

1. Aprovar esta auditoria.
2. Definir fontes e especificacao do motor matematico.
3. Implementar o motor separado da interface.
4. Criar testes automatizados com casos validados.
5. Construir base de conhecimento revisada.
6. Ligar a experiencia gratuita ao motor real.
7. Somente depois criar relatorio pago e checkout.

## Arquivos desta auditoria

- `01-visao-geral-do-projeto.md`
- `02-mapa-de-arquivos-e-arquitetura-atual.md`
- `03-auditoria-do-motor-de-calculo.md`
- `04-auditoria-do-mapa-dos-chakras.md`
- `05-auditoria-de-protocolos-e-relatorios.md`
- `06-auditoria-do-uso-de-ia.md`
- `07-auditoria-de-dados-e-privacidade.md`
- `08-problemas-e-riscos.md`
- `09-arquitetura-recomendada.md`
- `10-contrato-de-saida-do-motor.md`
- `11-plano-de-testes.md`
- `12-plano-de-reconstrucao.md`
