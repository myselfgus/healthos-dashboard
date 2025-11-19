export const generateLogs = (action: string): string[] => {
  const timestamp = new Date().toLocaleTimeString();
  return [
    `[${timestamp}] INICIANDO: ${action}...`,
    `[${timestamp}] VERIFICANDO: Configurações de ambiente carregadas.`,
    `[${timestamp}] CONEXÃO: Voither HealthOS Gateway [OK]`,
    `[${timestamp}] MODELO: Carregando par����metros...`,
    `[${timestamp}] PROCESSANDO: Aguardando resposta do pipeline...`,
  ];
};
export const mockPatients = [
  { id: 1, name: 'Paciente 1001', lastUpdate: '2 horas atrás', transcriptions: 12, analyses: 8, status: 'ATIVO' },
  { id: 2, name: 'Paciente 1002', lastUpdate: '5 horas atrás', transcriptions: 8, analyses: 5, status: 'ATIVO' },
  { id: 3, name: 'Paciente 1003', lastUpdate: '1 dia atrás', transcriptions: 21, analyses: 15, status: 'ATIVO' },
  { id: 4, name: 'Paciente 1004', lastUpdate: '3 dias atrás', transcriptions: 5, analyses: 4, status: 'EM OBS' },
  { id: 5, name: 'Paciente 1005', lastUpdate: '1 semana atrás', transcriptions: 3, analyses: 1, status: 'INATIVO' },
  { id: 6, name: 'Paciente 1006', lastUpdate: '2 semanas atrás', transcriptions: 32, analyses: 28, status: 'ATIVO' },
];
export const generateAiResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  if (lowerInput.includes('pacientes')) {
    return `Atualmente, existem ${mockPatients.length} pacientes no sistema. ${mockPatients.filter(p => p.status === 'ATIVO').length} estão ativos. Você pode visualizar todos na aba "Pacientes".`;
  }
  if (lowerInput.includes('transcrever') || lowerInput.includes('audio')) {
    return "Para iniciar uma nova transcrição, você pode clicar no card 'Transcrever Áudio' ou usar o atalho na barra lateral. O sistema processará os arquivos da pasta `/audio`.";
  }
  if (lowerInput.includes('ajuda') || lowerInput.includes('comandos')) {
    return "Comandos disponíveis:\n- `listar pacientes`: Mostra um resumo dos pacientes.\n- `status do sistema`: Verifica a saúde dos serviços.\n- `iniciar transcrição`: Dicas sobre como transcrever áudios.\n- `��ltima análise`: Informa sobre a análise mais recente.";
  }
  if (lowerInput.includes('status')) {
    return "Todos os sistemas estão operacionais. A conexão com o MongoDB Atlas está estável e o pipeline de análise está pronto para receber novas tarefas.";
  }
  if (lowerInput.includes('análise') || lowerInput.includes('asl')) {
    return "A última Análise Sistêmica Linguística (ASL) foi concluída para o Paciente 1006 há 2 dias. 98% de todas as transcriç��es foram processadas com sucesso.";
  }
  return "Desculpe, não entendi o comando. Digite `ajuda` para ver uma lista de comandos que eu conheço.";
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