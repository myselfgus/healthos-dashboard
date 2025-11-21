import { Users, Mic, FileText, Brain, FolderOpen, Activity, Network, ShieldCheck, LucideIcon } from 'lucide-react';
import { GenUIComponent } from '@/components/genui/GenerativeWidgets';
export type PatientStatus = 'ATIVO' | 'EM OBS' | 'INATIVO';
export interface Patient {
  id: number;
  name: string;
  lastUpdate: string;
  transcriptions: number;
  analyses: number;
  status: PatientStatus;
}
export const generateLogs = (action: string): string[] => {
  const timestamp = new Date().toLocaleTimeString();
  return [
    `[${timestamp}] INICIANDO: ${action}...`,
    `[${timestamp}] VERIFICANDO: Configurações de ambiente carregadas.`,
    `[${timestamp}] CONEXÃO: Voither HealthOS Gateway [OK]`,
    `[${timestamp}] MODELO: Carregando parâmetros...`,
    `[${timestamp}] PROCESSANDO: Aguardando resposta do pipeline...`,
  ];
};
export const mockPatients: Patient[] = [
  { id: 1, name: 'Paciente 1001', lastUpdate: '2 horas atrás', transcriptions: 12, analyses: 8, status: 'ATIVO' },
  { id: 2, name: 'Paciente 1002', lastUpdate: '5 horas atrás', transcriptions: 8, analyses: 5, status: 'ATIVO' },
  { id: 3, name: 'Paciente 1003', lastUpdate: '1 dia atrás', transcriptions: 21, analyses: 15, status: 'ATIVO' },
  { id: 4, name: 'Paciente 1004', lastUpdate: '3 dias atrás', transcriptions: 5, analyses: 4, status: 'EM OBS' },
  { id: 5, name: 'Paciente 1005', lastUpdate: '1 semana atrás', transcriptions: 3, analyses: 1, status: 'INATIVO' },
  { id: 6, name: 'Paciente 1006', lastUpdate: '2 semanas atrás', transcriptions: 32, analyses: 28, status: 'ATIVO' },
];
export const mockAgents: { id: string; title: string; desc: string; icon: LucideIcon; tag: string; status: 'online' | 'busy' | 'offline' }[] = [
    { id: 'transcribe', title: 'Transcrever Áudio', desc: 'Pipeline ElevenLabs STT com diarização automática de falantes para arquivos na pasta /audio.', icon: Mic, tag: 'V1.0', status: 'online' },
    { id: 'process', title: 'Processar Dossiês', desc: 'Extração de metadados, conferência e organização de pastas para novos pacientes.', icon: FolderOpen, tag: 'AUTO', status: 'online' },
    { id: 'asl', title: 'Análise ASL', desc: 'Análise Sistêmica Linguística (Psicolinguística) utilizando Claude Sonnet 4.5.', icon: Brain, tag: 'SONNET', status: 'busy' },
    { id: 'dim', title: 'Dimensional (M)', desc: 'Extração das 15 dimensões do espaço mental: Afetiva, Cognitiva e Linguística.', icon: Activity, tag: '15-DIM', status: 'online' },
    { id: 'gem', title: 'Grafo GEM', desc: 'Geração de Grafos do Espaço-Campo Mental (AJE + IRE + E) para visualização topológica.', icon: Network, tag: 'GRAPH', status: 'offline' },
    { id: 'anon', title: 'Anonimizar', desc: 'Pipeline de segurança para remover PII de transcrições e análises antes do upload.', icon: ShieldCheck, tag: 'PRIVACY', status: 'online' },
];
export const mockAppointments = [
    { patient: 'Paciente 1001', time: '09:00', date: 'Hoje' },
    { patient: 'Paciente 1003', time: '10:30', date: 'Hoje' },
    { patient: 'Paciente 1002', time: '14:00', date: 'Amanhã' },
    { patient: 'Paciente 1006', time: '11:00', date: '25/07' },
];
export const generateAiResponse = (userInput: string): { content: string; uiComponent?: GenUIComponent } => {
  const lowerInput = userInput.toLowerCase();

  // === Padrão 1: Busca de Pacientes ===
  const patientMatch = lowerInput.match(/paciente (\d+)/);
  if (patientMatch && patientMatch[1]) {
    const patientId = parseInt(patientMatch[1], 10);
    const patient = mockPatients.find(p => p.name.includes(patientId.toString()));
    if (patient) {
      return {
        content: `✓ Encontrei o ${patient.name}. Aqui está o resumo completo com métricas atualizadas:`,
        uiComponent: {
          type: 'patient_summary',
          data: {
            name: patient.name,
            id: `P${patient.id.toString().padStart(4, '0')}`,
            lastUpdate: patient.lastUpdate,
            status: patient.status,
            metrics: [
              { label: 'Transcrições', value: patient.transcriptions },
              { label: 'Análises ASL', value: patient.analyses },
              { label: 'Status', value: patient.status },
            ],
          },
        },
      };
    } else {
      return { content: `⚠ Paciente com ID ${patientId} não encontrado no sistema. Verifique o ID e tente novamente.` };
    }
  }

  // === Padrão 2: Listagem de Pacientes ===
  if (lowerInput.includes('listar') || lowerInput.includes('lista') || lowerInput.includes('todos os pacientes')) {
    const summary = mockPatients.map(p => `• ${p.name} [${p.status}] - ${p.lastUpdate}`).join('\n');
    return { content: `📋 Pacientes cadastrados no sistema:\n\n${summary}\n\nDigite "paciente [ID]" para ver detalhes de um paciente específico.` };
  }

  // === Padrão 3: Planos de Ação ===
  if (lowerInput.includes('plano') || lowerInput.includes('recomendações') || lowerInput.includes('próximos passos')) {
    return {
      content: "✓ Plano de ação gerado com base na última análise ASL. Aqui estão as recomendações prioritárias:",
      uiComponent: {
        type: 'action_plan',
        data: {
          title: 'Plano de Ação - Paciente 1001',
          steps: [
            { id: '1', description: 'Agendar sessão de acompanhamento', completed: false },
            { id: '2', description: 'Revisar resultados da análise dimensional', completed: true },
            { id: '3', description: 'Preparar relatório para o paciente', completed: false },
            { id: '4', description: 'Acompanhar evolução das métricas afetivas', completed: false },
          ],
        },
      },
    };
  }

  // === Padrão 4: Histórico e Gráficos ===
  if (lowerInput.includes('vitais') || lowerInput.includes('histórico') || lowerInput.includes('gráfico') || lowerInput.includes('engajamento')) {
    return {
      content: "📊 Gráfico de engajamento semanal gerado. Os dados mostram uma tendência positiva nas últimas semanas:",
      uiComponent: {
        type: 'vitals_chart',
        data: {
          title: 'Engajamento Semanal',
          data: [
            { name: 'Sem 1', value: 65 },
            { name: 'Sem 2', value: 70 },
            { name: 'Sem 3', value: 85 },
            { name: 'Sem 4', value: 80 },
            { name: 'Sem 5', value: 90 },
          ],
        },
      },
    };
  }

  // === Padrão 5: Status do Sistema ===
  if (lowerInput.includes('status') || lowerInput.includes('sistema') || lowerInput.includes('agentes')) {
    const onlineAgents = mockAgents.filter(a => a.status === 'online').length;
    const totalAgents = mockAgents.length;
    return {
      content: `🟢 Sistema operacional.\n\n**Agentes:** ${onlineAgents}/${totalAgents} online\n**Pacientes ativos:** ${mockPatients.filter(p => p.status === 'ATIVO').length}\n**Última sincronização:** Há 2 minutos\n\nTodos os serviços principais estão funcionando normalmente.`
    };
  }

  // === Padrão 6: Análise ASL ===
  if (lowerInput.includes('asl') || lowerInput.includes('análise') || lowerInput.includes('dimensões')) {
    return {
      content: "🧠 A Análise Sistêmica Linguística (ASL) extrai 15 dimensões do espaço mental:\n\n**Afetiva:** Emoções, sentimentos, estado emocional\n**Cognitiva:** Raciocínio, memória, atenção\n**Linguística:** Padrões de fala, vocabulário, coerência\n\nGostaria de iniciar uma nova análise? Digite 'plano de ação' para ver recomendações."
    };
  }

  // === Padrão 7: Agendamentos ===
  if (lowerInput.includes('agenda') || lowerInput.includes('consultas') || lowerInput.includes('próximas sessões')) {
    const todayAppointments = mockAppointments.filter(a => a.date === 'Hoje');
    const summary = todayAppointments.map(a => `• ${a.patient} às ${a.time}`).join('\n');
    return {
      content: `📅 Consultas agendadas para hoje:\n\n${summary}\n\nTotal de ${mockAppointments.length} consultas esta semana.`
    };
  }

  // === Padrão 8: Busca Semântica Avançada ===
  if (lowerInput.includes('como') || lowerInput.includes('o que é') || lowerInput.includes('explique')) {
    return {
      content: "💡 Posso ajudar com informações sobre:\n\n• **Pacientes** - Digite 'paciente [ID]' ou 'listar pacientes'\n• **Análises** - Digite 'análise ASL' ou 'dimensões'\n• **Agendamentos** - Digite 'agenda' ou 'consultas'\n• **Gráficos** - Digite 'histórico' ou 'gráfico'\n• **Sistema** - Digite 'status' ou 'agentes'\n\nO que você gostaria de saber?"
    };
  }

  // === Padrão 9: Comandos de Ajuda ===
  if (lowerInput.includes('ajuda') || lowerInput.includes('help') || lowerInput.includes('comandos')) {
    return {
      content: "🤖 **HealthOS GenAI Assistant - Comandos Disponíveis:**\n\n" +
               "**Pacientes:**\n" +
               "• `paciente [ID]` - Ver detalhes (ex: paciente 1001)\n" +
               "• `listar pacientes` - Mostrar todos os pacientes\n\n" +
               "**Análises:**\n" +
               "• `plano de ação` - Gerar recomendações\n" +
               "• `análise ASL` - Info sobre análise linguística\n\n" +
               "**Visualizações:**\n" +
               "• `histórico` - Gráfico de engajamento\n" +
               "• `agenda` - Ver consultas agendadas\n\n" +
               "**Sistema:**\n" +
               "• `status` - Status dos agentes\n" +
               "• `ajuda` - Mostrar esta mensagem"
    };
  }

  // === Resposta Padrão Inteligente ===
  const suggestions = [
    "Tente 'paciente 1001' para ver um resumo",
    "Digite 'listar pacientes' para ver todos",
    "Use 'plano de ação' para recomendações",
    "Pergunte 'status' para ver o sistema",
  ];
  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

  return {
    content: `🤔 Não encontrei um comando específico para "${userInput}".\n\n💡 Sugestão: ${randomSuggestion}\n\nDigite "ajuda" para ver todos os comandos disponíveis.`
  };
};
export const mockFiles = [
  { id: '1', name: 'Paciente 1001', type: 'folder', size: '--', lastModified: '2024-05-20 09:00 AM' },
  { id: '2', name: 'Paciente 1002', type: 'folder', size: '--', lastModified: '2024-05-19 14:20 PM' },
  { id: '3', name: 'transcricao_1001_sessao_1.wav', type: 'wav', size: '15.8 MB', lastModified: '2024-05-20 09:15 AM' },
  { id: '4', name: 'analise_asl_1001.pdf', type: 'pdf', size: '1.2 MB', lastModified: '2024-05-20 10:30 AM' },
  { id: '5', name: 'notas_sessao_1002.txt', type: 'txt', size: '5 KB', lastModified: '2024-05-19 15:00 PM' },
  { id: '6', name: 'relatorio_dimensional_1001.json', type: 'json', size: '256 KB', lastModified: '2024-05-20 11:00 AM' },
  { id: '7', name: 'Paciente 1003', type: 'folder', size: '--', lastModified: '2024-05-18 11:45 AM' },
  { id: '8', name: 'grafo_gem_1002.svg', type: 'svg', size: '780 KB', lastModified: '2024-05-19 16:00 PM' },
  { id: '9', name: 'consentimento_informado_1003.pdf', type: 'pdf', size: '800 KB', lastModified: '2024-05-18 11:50 AM' },
  { id: '10', name: 'audio_sessao_1003_pt1.wav', type: 'wav', size: '22.1 MB', lastModified: '2024-05-18 12:30 PM' },
];