# F7.2 — Privacy, Retention & Export Coherence

## Escopo autorizado

Este baseline segue a decisão do Arquiteto após a aprovação de F7.3. O objetivo é reconciliar o contrato público com o comportamento real, sem criar uma grande feature de direitos, sem implementar checkout, sem ampliar o painel administrativo e sem alterar o engine Dreamspell/13 Luas.

## Inventário de dados observável

| Superfície | Dados observáveis | Armazenamento atual |
|---|---|---|
| Identidade e consentimento | identidade de Auth, e-mail, nome de exibição, versões de Privacy/Terms e instante de aceite | Supabase Auth; `profiles`; `consent_records` |
| Perfil | nome, data de nascimento, área principal | `profiles` no Supabase; estado local também pode conter cópia de sessão |
| Leituras | snapshot de leitura, histórico, metadados de área/data/versão | `readings.payload` no Supabase; estado local/cache contém o estado corrente |
| Progresso | jornada e momentos de prática | `journey_progress`, `protocol_progress`; chaves locais de progresso |
| Linha do tempo | eventos, título, data, categoria, nota e coordenadas | `timeline_events`; estado local/cache |
| Conta local | estado persistido, conta local e progresso | `localStorage` sob chaves versionadas |

## Matriz de coerência

| Afirmação pública | Implementação observada | Estado F7.2 | Risco/ação |
|---|---|---|---|
| O modo local armazena registros no navegador | `localStorage` é usado para estado, conta local e progresso | coerente | manter linguagem local-first quando aplicável |
| Contas sincronizadas armazenam dados no Supabase | signup/profile, leituras, eventos e progressos usam Supabase | coerente com ressalva | deixar claro que dados locais/cache podem coexistir no navegador |
| Perfil permite exportar os dados principais | `downloadLocalBackup()` exporta snapshot local, conta em memória e progresso local | **parcial em conta sincronizada** | não chamar isso de exportação completa da conta Supabase; limitar texto ou corrigir fluxo antes de prometer export completo |
| Exportação inclui histórico e progresso | modo local inclui histórico persistido e progresso local; modo Supabase carrega apenas até 8 leituras, eventos e progresso contextualizado antes de exportar | **não comprovado como completo em sincronizado** | tratar como backup local do estado disponível, não como exportação integral de direitos |
| Usuário pode excluir dados locais do dispositivo | handler remove as cinco chaves locais conhecidas e reseta estado | coerente para as chaves do app | manter explicação de que cópias externas/arquivos exportados não são apagados |
| Usuário pode excluir conta sincronizada e dados relacionados | Edge Function autentica o chamador e chama `auth.admin.deleteUser`; cascatas do schema devem ser validadas no gate delete/cascade | **implementação existente, prova completa pendente** | não prometer além do que a prova de cascata e retenção confirmar |
| Retenção | política diz que dados locais permanecem até exclusão e ainda deixa prazos definitivos pendentes antes do comercial | **incompleto, mas explicitamente beta** | definir coerência operacional mínima ou manter o produto fora do go-live comercial |
| Direitos LGPD, controlador e bases legais | política declara que identificação jurídica, bases legais, prazos e procedimento definitivo ainda serão completados | honesto para beta, insuficiente para comercial | não editar com informação jurídica inventada; solicitar dados/decisão do responsável |
| Contato de privacidade | e-mail de contato público | existente | validar canal operacional sem expor novos dados |

## Achados prioritários

### F7.2-EXPORT-001 — escopo de exportação sincronizada não demonstrado

A UI usa o mesmo botão `Exportar meus dados` em perfil, mas a implementação chama `downloadLocalBackup()`. O payload é derivado de `state`, `localStorage` e progresso local. Em modo Supabase, `loadCloudState()` busca somente um subconjunto operacional do histórico e eventos, e o progresso é carregado por contexto/data. Não existe no cliente uma função de exportação que leia integralmente `profiles`, `consent_records`, todas as `readings`, todos os progressos e todos os `timeline_events` da conta para um pacote de direitos.

A promessa pública atual é limitada a “dados principais da conta local”, o que reduz o risco, mas o rótulo genérico do botão pode induzir que uma conta sincronizada foi exportada integralmente. Este é o principal ponto de coerência a decidir: ou o texto/UI fica explicitamente limitado a backup local do estado disponível, ou se implementa um export sincronizado completo em fase posterior autorizada.

### F7.2-RETENTION-001 — retenção definitiva ainda não definida

A política informa que prazos de retenção, identificação jurídica do controlador, bases legais e procedimento definitivo de direitos serão preenchidos antes do lançamento comercial. Não deve ser inventado um prazo. O produto pode permanecer em beta controlado com essa limitação explícita, mas o gate de go-live comercial não deve considerar a política finalizada sem decisão do responsável.

### F7.2-DELETE-001 — exclusão sincronizada precisa de prova de cascata

A Edge Function valida o token do chamador e solicita a exclusão administrativa da identidade. O schema usa cascatas para a maior parte dos dados de usuário e `SET NULL` para o ator de auditoria; `app_settings.updated_by` possui referência sem ação explícita e precisa ser considerada se vier a ser preenchida. Ainda falta a prova controlada de delete/cascade autorizada para a conta A, sem expor identificadores e sem tocar na conta B ou na testemunha C.

## Restrições preservadas

Nenhum engine, Kin, selo, tom, onda encantada, política lunar, configuração metodológica, checkout, role owner, conta B, conta C ou dado real de usuário foi alterado nesta auditoria. A decisão arquitetural necessária antes de qualquer correção de texto é se a capacidade de exportação pública deve ser descrita como **backup local do estado disponível** ou se existe autorização para implementar um export sincronizado completo.

## Decisão arquitetural e correção autorizada

O Arquiteto autorizou **não implementar** exportação sincronizada completa neste gate. Para resolver `F7.2-EXPORT-001`, a interface deve declarar sem ambiguidade que a capacidade atual é um **backup local do estado disponível**. A ação do Perfil foi renomeada para `Baixar backup local`, com explicação de que o arquivo cobre somente o estado disponível no navegador e não é uma exportação completa da conta sincronizada. A política pública recebeu a mesma distinção e orienta pedidos de confirmação, acesso, portabilidade ou outros direitos aplicáveis aos dados sincronizados pelo canal de contato, sem inventar prazos ou bases legais.

A correção não altera o engine, a metodologia, o armazenamento, a exclusão de conta, o checkout ou qualquer superfície administrativa. O service worker foi versionado para `drive-mental-web-v46` para invalidar a cópia anterior da PWA. A implementação de exportação sincronizada completa permanece como capacidade futura, fora do escopo deste gate.
