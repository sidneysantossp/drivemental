# Planejamento do Painel Admin

## Objetivo

Criar uma area administrativa propria da plataforma para operar usuarios, planos,
acessos, metodologia lunar, jornadas e configuracoes globais sem depender do
painel do Supabase no dia a dia.

URL prevista:

```text
/admin
```

## Areas do painel

```text
/admin/login
/admin/dashboard
/admin/usuarios
/admin/usuarios/:id
/admin/acessos
/admin/planos
/admin/metodologia
/admin/jornadas
/admin/acompanhamentos
/admin/configuracoes
/admin/auditoria
```

## Configuracoes

A area **Configuracoes** deve concentrar todos os controles operacionais da
plataforma que nao pertencem a um usuario especifico.

### 1. Configuracoes gerais

- nome publico da plataforma;
- e-mail de suporte;
- dominio oficial;
- status da plataforma: beta, homologacao, producao;
- mensagem global para usuarios;
- modo de manutencao;
- links de politica de privacidade e termos.

### 2. Planos e precos exibidos

- nome do plano gratuito;
- nome do plano Premium;
- nome do plano Mentor;
- valor exibido do Premium;
- valor exibido do Mentor;
- beneficios de cada plano;
- visibilidade dos cards de planos;
- texto dos botoes de CTA;
- badge exibido em cada plano.

Estado atual desejado:

```text
Drive Astral: badge PREMIUM, valor R$29,90
Jornada Guiada: badge MENTOR, valor R$97,00
CTA: INICIAR A MINHA JORNADA
```

### 3. Checkout externo

Como a plataforma nao processa pagamentos internamente, esta area deve guardar
apenas links publicos:

- URL de checkout Premium;
- URL de checkout Mentor;
- provedor principal: Hotmart, Kiwify ou outro;
- instrucao operacional apos pagamento;
- texto de suporte para problemas de acesso.

Nao deve guardar:

- dados de cartao;
- token secreto do provedor;
- webhook de pagamento;
- senha de usuarios.

### 4. Acesso e credenciais

Configuracoes para operacao manual do acesso apos pagamento:

- template do e-mail de boas-vindas;
- template de envio de usuario e senha inicial;
- template de redefinicao de senha;
- prazo padrao de acesso Premium;
- prazo padrao de acesso Mentor;
- regra de expiracao;
- status permitidos: ativo, pausado, expirado, cancelado, cortesia.

O admin nunca deve visualizar senha atual. Quando necessario, deve enviar link
seguro de redefinicao de senha.

### 5. Metodologia lunar

Controles globais da metodologia:

- versao ativa da metodologia;
- versao em rascunho;
- politica para 29 de fevereiro;
- frase do dia;
- mantras;
- conteudos por Kin;
- conteudos das 13 Luas;
- protocolos diarios;
- textos por area de vida;
- textos por chakra;
- status de publicacao.

### 6. Jornada e acompanhamento

Configuracoes do plano Mentor:

- duracao padrao da jornada;
- extensao opcional para 180 dias;
- frequencia de check-in;
- templates de tarefas;
- templates de mensagens do mentor;
- limites de acompanhamento;
- criterios para pausar, reiniciar ou concluir jornada.

### 7. E-mails e comunicacao

- remetente padrao;
- assinatura do suporte;
- templates transacionais;
- aviso de manutencao;
- aviso de expiracao de acesso;
- aviso de inicio de jornada;
- aviso de conclusao de jornada.

### 8. Seguranca

- lista de administradores;
- permissoes por perfil;
- obrigatoriedade de e-mail confirmado;
- tempo de sessao admin;
- registro de auditoria;
- bloqueio de acoes sensiveis sem confirmacao.

Perfis sugeridos:

```text
owner: acesso total
admin: usuarios, planos, conteudo e acessos
mentor: acompanhamentos e notas de usuarios mentorados
support: suporte, acesso e redefinicao de senha
content: metodologia, textos e publicacao
```

### 9. Aparencia da plataforma

- logo;
- cores principais;
- textos da landing page;
- imagens de exemplo;
- destaque de plano;
- banners e avisos temporarios.

## Tabelas sugeridas

```text
admin_roles
admin_audit_logs
app_settings
plan_catalog
user_access_plans
methodology_versions
methodology_contents
journey_templates
journey_assignments
mentor_notes
email_templates
```

## Regras de seguranca

- apenas usuarios com role admin acessam `/admin`;
- usuarios comuns nunca consultam tabelas administrativas;
- toda alteracao de Configuracoes gera auditoria;
- a chave `service_role` nunca aparece no frontend;
- senha de usuario nunca e exibida;
- acoes sensiveis exigem confirmacao visual.

## MVP recomendado

Primeira versao do admin:

1. Login admin protegido por role.
2. Dashboard com contadores principais.
3. Usuarios com busca e detalhe.
4. Acessos com liberacao manual de Premium ou Mentor.
5. Configuracoes com:
   - precos;
   - badges;
   - links de checkout;
   - e-mail de suporte;
   - textos dos CTAs;
   - modo manutencao.
6. Auditoria basica.

Segunda versao:

1. CMS da metodologia lunar.
2. Editor de jornadas.
3. Acompanhamento Mentor.
4. Templates de e-mail.
5. Relatorios e exportacao.
