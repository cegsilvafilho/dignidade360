# Modelo de dados, governança e indicadores

## 1. Princípio central

A Dignidade 360 deve ser construída em torno de um **registro longitudinal do paciente**, com todos os eventos importantes organizados em uma timeline.

Não basta ter tabelas soltas. Cada dado precisa responder:

- quem registrou;
- quando registrou;
- a qual paciente pertence;
- qual ação gerou;
- quem pode ver;
- qual desfecho teve;
- se existe consentimento;
- se precisa entrar nos indicadores.

## 2. Entidades principais

### Organização

Representa hospital, clínica, atenção domiciliar, operadora ou rede.

Campos:

- nome;
- tipo;
- CNPJ;
- status;
- responsável;
- política de acesso;
- configurações.

### Unidade

Representa unidade física ou serviço.

Campos:

- organização;
- nome;
- tipo;
- endereço;
- equipe responsável;
- status.

### Usuário

Representa qualquer pessoa com login.

Campos:

- nome;
- e-mail;
- telefone;
- papel;
- organização;
- unidade;
- status;
- último login;
- autenticação em dois fatores.

### Paciente

Campos:

- nome;
- data de nascimento;
- documento;
- contato;
- condição principal;
- linha de cuidado;
- unidade;
- profissional responsável;
- cuidador principal;
- prioridade atual;
- status;
- objetivo de cuidado;
- plano de crise;

### Cuidador

Campos:

- usuário;
- paciente;
- grau de relação;
- permissões;
- status;
- data de autorização;

### Linha de cuidado

Campos:

- nome;
- critério de entrada;
- equipe responsável;
- SLA por prioridade;
- questionários;
- protocolos;
- conteúdos recomendados;
- status.

### Check-in

Campos:

- paciente;
- respondente;
- data/hora;
- dor;
- falta de ar;
- ansiedade;
- fadiga;
- apetite;
- sono;
- mobilidade;
- crise;
- observação;
- prioridade calculada;
- regra aplicada.

### Alerta

Campos:

- paciente;
- origem;
- gravidade;
- título;
- descrição;
- status;
- responsável;
- SLA;
- data de criação;
- data de primeira resposta;
- data de resolução;
- desfecho.

### Conduta

Campos:

- paciente;
- alerta relacionado;
- profissional;
- tipo;
- descrição;
- data/hora;
- próxima ação;
- desfecho;

### Plano de cuidado

Campos:

- paciente;
- objetivos;
- sintomas prioritários;
- intervenções;
- equipe responsável;
- frequência de acompanhamento;
- versão;
- status;
- data de revisão.

### Plano de crise

Campos:

- paciente;
- sinais de alerta;
- o que fazer;
- quem acionar;
- quando acionar emergência;
- medicações prescritas de resgate, se houver;
- preferências;
- versão;
- status;

### Timeline

Tabela agregadora de eventos.

Campos:

- paciente;
- tipo de evento;
- origem;
- título;
- descrição;
- data/hora;
- usuário responsável;
- objeto relacionado;
- visibilidade.

Tipos de evento:

- check-in;
- alerta;
- conduta;
- mensagem;
- agenda;
- plano atualizado;
- reunião familiar;
- consentimento;
- crise;
- desfecho;
- luto.

### Consentimento

Campos:

- paciente;
- tipo;
- finalidade;
- autorizado;
- data;
- versão do termo;
- canal de coleta;
- revogado em;

### Auditoria

Campos:

- usuário;
- ação;
- entidade;
- registro;
- data/hora;
- IP/dispositivo;
- justificativa;
- resultado.

## 3. Camada de indicadores

Indicadores devem ser derivados dos eventos, não preenchidos manualmente.

### Indicadores assistenciais

- pacientes ativos;
- prioridade atual;
- sintomas mais frequentes;
- pacientes com dor alta;
- pacientes com falta de ar alta;
- pacientes sem plano de crise;
- pacientes sem check-in;
- alertas críticos;
- tempo até resposta;
- tempo até resolução.

### Indicadores de família

- cuidadores ativos;
- sobrecarga média;
- solicitações de apoio;
- famílias em luto;
- contatos pós-óbito;

### Indicadores operacionais

- SLA cumprido;
- fila em atraso;
- alertas por profissional;
- condutas por equipe;
- pacientes por unidade;
- volume por linha de cuidado.

### Indicadores institucionais

- reinternações;
- pronto atendimento;
- transições hospital-domicílio;
- planos de crise ativos;
- satisfação;
- adesão ao programa.

## 4. Governança de dados

### Regras

- Dados clínicos são sensíveis.
- Acesso depende de papel, vínculo e finalidade.
- Gestor deve ver agregados por padrão.
- Cuidador só acessa com autorização.
- Toda exportação deve ser auditada.
- Toda alteração de plano deve manter versão anterior.

### Permissões por perfil

| Entidade | Paciente | Cuidador | Profissional | Gestor | Admin |
|---|---:|---:|---:|---:|---:|
| Paciente | Próprio | Autorizado | Vinculado | Agregado | Configuração |
| Check-in | Criar/ver próprio | Criar/ver autorizado | Ver vinculados | Agregado | Auditoria |
| Alerta | Ver simplificado | Ver simplificado | Criar/editar | Agregado | Configuração |
| Conduta | Ver autorizada | Ver autorizada | Criar/editar | Agregado | Auditoria |
| Plano | Ver próprio | Ver autorizado | Criar/editar | Agregado | Auditoria |
| Consentimento | Gerenciar | Não | Ver escopo | Agregado | Auditar |
| Auditoria | Não | Não | Parcial | Parcial | Sim |

## 5. Regras de qualidade de dados

- Todo alerta deve ter paciente.
- Todo alerta deve ter status.
- Todo alerta resolvido deve ter desfecho.
- Todo plano de crise deve ter versão.
- Todo cuidador deve ter permissão explícita.
- Toda conduta deve ter profissional responsável.
- Todo acesso sensível deve gerar auditoria.

## 6. Modelo inspirado em plataformas enterprise

O dado deve alimentar:

- visão 360 do paciente;
- timeline;
- alertas;
- segmentação;
- indicadores;
- sugestões de próxima ação;
- relatórios;
- integração futura.

Exemplos de segmentos:

- pacientes sem plano de crise;
- pacientes com falta de ar alta;
- cuidadores com sobrecarga alta;
- pacientes com alerta crítico aberto;
- pacientes pós-alta sem check-in;
- pacientes com SLA vencido.

