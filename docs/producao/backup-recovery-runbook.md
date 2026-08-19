# Runbook de Backup Lógico e Recuperação — Drive Mental

**Status:** controle mínimo operacional autorizado na Fase 6
**Projeto canônico:** Supabase `qgvlkpaociypyxduvsqm`
**Estratégia escolhida:** backup lógico próprio, reproduzível e armazenado fora do projeto
**Autoridade:** ChatGPT Arquiteto — F6.2 P0
**Data:** 19 de agosto de 2026

## 1. Decisão operacional

O projeto Supabase está no plano Free, que não inclui backups de projeto gerenciados. A estratégia mínima adotada é gerar um dump lógico do PostgreSQL por meio dos utilitários oficiais `pg_dump`/`pg_dumpall`, seguindo o mesmo procedimento lógico recomendado pela CLI do Supabase, armazenar o artefato fora do repositório e fora do projeto Supabase, verificar hashes e provar a restauração em um projeto descartável ou outro alvo isolado. A mudança de plano não é realizada por este runbook e permanece decisão do responsável financeiro/produto.

A estratégia não deve ser confundida com backup físico gerenciado, PITR ou exportação completa de objetos do Supabase Storage. O dump inclui o schema público e seus dados; schemas gerenciados e objetos de Storage possuem tratamento separado. A documentação oficial recomenda `supabase db dump` para projetos Free; a rotina versionada usa diretamente `pg_dump`/`pg_dumpall` para não depender de Docker no host, mantendo os mesmos artefatos lógico-operacionais. A documentação também alerta que objetos armazenados pela Storage API não estão contidos no backup do banco [1] [2].

## 2. Escopo do artefato

| Componente | Inclusão | Tratamento |
|---|---:|---|
| `public` schema | Sim | `roles.sql`, `schema.sql` e `data.sql` gerados pela CLI. |
| Tabelas, índices, funções, triggers e políticas do `public` | Sim | Derivados do dump lógico; validação pós-restore deve confirmar a presença das relações críticas. |
| Dados de usuário no `public` | Sim | Inclui perfis, consentimentos, leituras, progresso, eventos, planos e configurações existentes; o artefato é sensível. |
| Histórico de migrations | Não por padrão | A fonte de verdade continua sendo `supabase/migrations/`; um dump separado de `supabase_migrations` pode ser produzido durante um procedimento de migração autorizado. |
| `auth` e `storage` gerenciados | Não por padrão | Alterações customizadas precisam ser diffadas/restauradas separadamente conforme a documentação oficial [1]. Não versionar dados de Auth. |
| Objetos binários do Supabase Storage | Não | A Storage API deve ter exportação própria se vier a ser utilizada. |
| Chaves, senhas, JWTs e tokens | Nunca | São fornecidos somente por variáveis de ambiente no momento da operação e não entram no artefato. |

As migrations atuais são `202606130001_initial_schema.sql`, `202606240001_remove_payment_integration.sql`, `202606240002_admin_foundation.sql`, `202606240003_admin_users_plans.sql`, `202607160001_first_reading_flow.sql` e `202607170001_consultation_guardrails.sql`. O backup é complementar ao versionamento dessas migrations, não um substituto para schema-as-code.

## 3. Comando/processo de exportação

A rotina versionada é `scripts/backup-supabase.sh` e requer `pg_dump`, `pg_dumpall` e `psql` instalados no host operacional. Ela exige `SUPABASE_DB_URL` somente no ambiente de execução e `DM_BACKUP_DIR` apontando para armazenamento seguro fora de `/home/ubuntu/drivemental`. A rotina cria um diretório com timestamp UTC, aplica modo `700` no diretório e `600` nos arquivos, gera `roles.sql`, `schema.sql`, `data.sql` e `manifest.txt`, e registra SHA-256 dos três dumps. O log de erro é redigido para não imprimir URLs, senhas ou tokens.

O operador deve executar o equivalente a:

```bash
export SUPABASE_PROJECT_REF="qgvlkpaociypyxduvsqm"
export SUPABASE_DB_URL='postgresql://<usuario>:<senha>@<pooler-ou-host>/postgres'
export DM_BACKUP_DIR='/var/backups/drive-mental'
./scripts/backup-supabase.sh dump
```

A senha não deve ser escrita em arquivo do repositório, em shell history persistente, em log ou na mensagem de reporte. A conexão deve usar TLS (`PGSSLMODE=require`). O modo de planejamento, que não acessa o banco, é:

```bash
DM_BACKUP_DIR='/var/backups/drive-mental' ./scripts/backup-supabase.sh --dry-run
```

## 4. Frequência, armazenamento, retenção e proteção

A frequência pretendida é **diária**, com uma execução sob responsabilidade operacional e possibilidade de agendamento externo posteriormente. O requisito mínimo é manter **14 pontos diários** e uma cópia mensal por **12 meses**, sujeitos à capacidade real do armazenamento escolhido. A execução deve falhar se o destino estiver dentro do repositório ou se `SUPABASE_DB_URL` não estiver presente.

O armazenamento deve ser externo ao projeto Supabase, privado, criptografado em repouso e acessível somente ao operador responsável. O repositório Git pode guardar apenas scripts, runbook e hashes de evidência; nunca deve guardar `roles.sql`, `schema.sql`, `data.sql`, credenciais ou dados pessoais. O artefato deve ser criptografado antes de sair do host de execução quando o armazenamento não fornecer criptografia gerenciada, e a chave de criptografia deve ser mantida em um gestor de segredos separado.

## 5. Processo de restore

A restauração lógica é permitida somente em projeto descartável, homologação isolada ou outro alvo que não contenha o identificador de produção. O script `scripts/restore-supabase.sh` bloqueia URLs que contenham o project ref de produção ou o domínio público da aplicação, exige `SUPABASE_RESTORE_CONFIRM=YES_ISOLATED_TARGET`, verifica os hashes e executa schema/data em uma transação com `ON_ERROR_STOP=1`. `roles.sql` fica separado para revisão manual, porque roles gerenciadas e permissões podem não ser recriáveis automaticamente em um projeto Supabase novo.

Exemplo de execução segura:

```bash
export DM_BACKUP_BUNDLE='/var/backups/drive-mental/qgvlkpaociypyxduvsqm/<timestamp>'
export SUPABASE_RESTORE_DB_URL='postgresql://<usuario>:<senha>@<projeto-descartavel>/postgres'
export SUPABASE_RESTORE_CONFIRM='YES_ISOLATED_TARGET'
./scripts/verify-backup-bundle.sh "$DM_BACKUP_BUNDLE"
./scripts/restore-supabase.sh
```

É proibido executar o script contra o projeto de produção. A documentação do Supabase recomenda restore manual em um projeto criado para esse fim e alerta para considerações especiais de `auth`, `storage`, roles, extensões, Webhooks, Realtime e chaves de criptografia [1].

## 6. Validação pós-restore

A validação deve confirmar, sem imprimir dados pessoais, que o destino contém as relações críticas `profiles`, `consent_records`, `readings`, `journey_progress`, `protocol_progress`, `timeline_events`, `admin_roles`, `app_settings`, `admin_audit_logs`, `plan_catalog` e `user_access_plans`; que RLS está habilitado nas tabelas aplicáveis; que as migrations versionadas podem ser reconciliadas; e que o aplicativo consegue executar uma leitura sintética não pessoal em homologação. A validação deve registrar apenas nomes de relações, flags de sucesso, contagens agregadas e hashes.

Não se deve concluir que uma restauração lógica reconstruiu automaticamente usuários Auth, objetos binários do Storage, configurações de Auth, segredos de Edge Functions ou configurações externas. Esses elementos devem ter inventário e procedimento próprio antes de qualquer declaração de recuperação completa.

## 7. RPO, RTO e critérios de incidente

O RPO inicial declarado é de **24 horas**, correspondente à frequência diária pretendida. O RTO alvo para recuperar o schema público e os dados em um projeto isolado é de **4 horas**, condicionado à disponibilidade da senha do banco, do armazenamento externo e de um projeto de destino. A recuperação de Auth, Storage, SMTP, secrets, domínio e integrações pode exigir prazo adicional e não está coberta pelo RTO do banco público.

Um incidente que exija recuperação deve preservar o projeto de produção para investigação, congelar deployments, registrar o último backup íntegro, calcular a perda potencial desde o timestamp do dump, preparar o alvo isolado e só então decidir uma migração de tráfego. Nenhuma restauração destrutiva em produção está autorizada por este runbook.

## 8. Prova segura executada na Fase 6

A prova desta fase deve demonstrar o modo `--dry-run`, a criação de um bundle sintético em diretório externo, a verificação de hashes e a recusa explícita de alvo de produção. Uma restauração real pode ser executada apenas quando houver credencial fornecida pelo responsável e um projeto descartável; não é permitido inventar sucesso com um artefato que não foi obtido do banco. Até que esse alvo e essa credencial estejam disponíveis, o estado correto da prova é **procedimento implementado e bloqueio de produção comprovado**, não “restore de produção validado”.

## Referências

[1]: https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore "Backup and Restore using the CLI — Supabase Docs"
[2]: https://supabase.com/docs/guides/platform/backups "Database Backups — Supabase Docs"
[3]: https://supabase.com/docs/reference/cli/supabase-db-dump "Supabase CLI db dump"
