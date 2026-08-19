# F6.5 — Classificação do drift do motor Sincronário

**Baseline de produção:** `bc4b33c`
**Arquivos analisados:** `src/domain/sincronario/core/engine.js`, `src/domain/sincronario/core/constants.js`, `src/domain/sincronario/core/index.js`, `tests/core-engine.test.js`, `tests/run-core-tests.js`
**Decisão:** **preservar como trabalho futuro fora do baseline**

## Matriz de classificação

| Campo | Estado observado |
|---|---|
| Origem | Artefatos locais não rastreados no tree de `bc4b33c`, associados ao trabalho anterior de isolamento do engine. |
| Finalidade | Propor uma API unificada para cálculos de Kin, Oracle e 13 Luas, com constantes centralizadas e testes próprios. |
| Diferenças | O drift usa `ENGINE_VERSION = 2.0.0-core`, `METHOD_ID = dreamspell-thirteen-moons`, âncora explícita de 26/07/1987, funções exportadas via CommonJS e cálculos próprios de Oracle/13 Luas. O baseline usa `src/domain/sincronario/engine.js`, `thirteen-moons-engine.js`, demais engines legados e fixtures/testes versionados diferentes. |
| Cobertura | O teste isolado cobre parsing, dia bissexto, Kin, Oracle, 13 Luas, datas limítrofes e um ciclo de 52 anos por meio de runner local próprio. Ele não está incluído no `npm test` do baseline e não foi executado pelo CI/deployment de `bc4b33c`. |
| Impacto metodológico | Alto e não aprovado para produção. Há fórmulas simplificadas e comentários de incerteza no cálculo de Oracle, além de hipóteses próprias de âncora, dias bissextos e Dia Fora do Tempo. A existência de testes locais não substitui a validação metodológica e os fixtures já aceitos. |
| Impacto frontend | Nenhum no baseline publicado. O `index.html` e os módulos versionados continuam referenciando os engines legados, não `src/domain/sincronario/core`. |
| Segurança de integração | Nenhum arquivo foi adicionado ao bundle, ao CI, ao Vercel ou ao Supabase. Não houve alteração de resultados, migrations, RLS ou comportamento funcional. |
| Decisão | Preservar como trabalho futuro fora do baseline. Qualquer integração exigirá uma futura decisão arquitetural específica, reconciliação metodológica, fixtures de referência, atualização consciente do frontend e novo ciclo de testes/release. |

## Justificativa da decisão

O drift é tecnicamente útil como material de pesquisa e isolamento, mas não possui rastreabilidade de produção nem aceitação metodológica suficiente para substituir o engine vigente durante a Fase 6. A decisão evita tanto a integração automática quanto o descarte prematuro de um artefato que pode ser avaliado em uma fase arquitetural futura.

Não será criado commit contendo esses arquivos. Eles permanecem fora do baseline protegido e não participam do build, do CI, do deployment nem da evidência de produção. Se o responsável decidir removê-los do workspace local em uma operação posterior, essa limpeza será tratada separadamente; não é necessária para fechar F6.5.
