entidade,campo,tipo,obrigatorio,descricao
organizacoes,id,uuid,sim,Identificador da organização
organizacoes,nome,texto,sim,Nome da organização
organizacoes,tipo,selecao,sim,Hospital clínica atenção domiciliar operadora rede
unidades,id,uuid,sim,Identificador da unidade
unidades,organizacao_id,uuid,sim,Organização vinculada
unidades,nome,texto,sim,Nome da unidade ou serviço
usuarios,id,uuid,sim,Identificador do usuário
usuarios,nome,texto,sim,Nome completo
usuarios,email,email,sim,E-mail de login
usuarios,papel,selecao,sim,Paciente cuidador profissional coordenador gestor admin
usuarios,unidade_id,uuid,nao,Unidade padrão do usuário
pacientes,id,uuid,sim,Identificador do paciente
pacientes,nome,texto,sim,Nome do paciente
pacientes,data_nascimento,data,nao,Data de nascimento
pacientes,condicao_principal,texto,sim,Condição clínica principal
pacientes,linha_cuidado_id,uuid,nao,Linha de cuidado vinculada
pacientes,prioridade_atual,selecao,sim,Baixa moderada alta crítica
pacientes,status,selecao,sim,Ativo pausado encerrado luto
cuidadores,id,uuid,sim,Identificador do vínculo de cuidador
cuidadores,paciente_id,uuid,sim,Paciente vinculado
cuidadores,usuario_id,uuid,sim,Usuário cuidador
cuidadores,permissoes,json,sim,Permissões concedidas pelo paciente
checkins,id,uuid,sim,Identificador do check-in
checkins,paciente_id,uuid,sim,Paciente relacionado
checkins,respondente_id,uuid,sim,Usuário que respondeu
checkins,dor,numero,sim,Escala 0 a 10
checkins,falta_ar,numero,sim,Escala 0 a 10
checkins,ansiedade,numero,sim,Escala 0 a 10
checkins,fadiga,numero,sim,Escala 0 a 10
checkins,crise,booleano,sim,Indica piora ou crise no dia
checkins,prioridade_calculada,selecao,sim,Baixa moderada alta crítica
alertas,id,uuid,sim,Identificador do alerta
alertas,paciente_id,uuid,sim,Paciente relacionado
alertas,gravidade,selecao,sim,Baixa moderada alta crítica
alertas,status,selecao,sim,Novo em atendimento escalonado resolvido cancelado
alertas,responsavel_id,uuid,nao,Profissional responsável
alertas,sla_minutos,numero,sim,SLA esperado em minutos
condutas,id,uuid,sim,Identificador da conduta
condutas,paciente_id,uuid,sim,Paciente relacionado
condutas,alerta_id,uuid,nao,Alerta relacionado
condutas,profissional_id,uuid,sim,Profissional responsável
condutas,tipo,selecao,sim,Orientação ligação visita reunião escalonamento
planos_cuidado,id,uuid,sim,Identificador do plano
planos_cuidado,paciente_id,uuid,sim,Paciente relacionado
planos_cuidado,objetivos,texto_longo,sim,Objetivos do cuidado
planos_cuidado,versao,numero,sim,Versão do plano
planos_crise,id,uuid,sim,Identificador do plano de crise
planos_crise,paciente_id,uuid,sim,Paciente relacionado
planos_crise,sinais_alerta,texto_longo,sim,Sinais que exigem ação
planos_crise,o_que_fazer,texto_longo,sim,Orientações aprovadas
timeline,id,uuid,sim,Identificador do evento
timeline,paciente_id,uuid,sim,Paciente relacionado
timeline,tipo_evento,selecao,sim,Check-in alerta conduta mensagem plano agenda consentimento
timeline,visibilidade,selecao,sim,Paciente equipe gestor admin
consentimentos,id,uuid,sim,Identificador do consentimento
consentimentos,paciente_id,uuid,sim,Paciente relacionado
consentimentos,tipo,selecao,sim,Cuidado cuidador mensagens dados agregados pesquisa
auditoria,id,uuid,sim,Identificador do log
auditoria,usuario_id,uuid,sim,Usuário que executou ação
auditoria,acao,texto,sim,Ação realizada
auditoria,entidade,texto,sim,Entidade afetada
auditoria,registro_id,uuid,nao,Registro afetado
