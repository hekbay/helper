import type { Attendee } from '../types/index';

export const INITIAL_ATTENDEES: Attendee[] = [
  {
    id: 'rise-vip-001',
    name: 'Carolina Santos Mendes',
    email: 'carolina.mendes@englishteach.com',
    phone: '(11) 98765-4321',
    instagram: '@carol.englishtips',
    level: 'VIP', // VIP + Mentorada = Crachá ESPECIAL
    status: 'CONFIRMED',
    isFlexge: true,
    isPresent: true,
    checkInTime: '08:45',
    isMentee: true,
    nearRenewal: true,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    expertNote: 'Professora de Business English em expansão. Faturando R$ 15k/mês. Ingresso VIP e já é Mentorada. Prioridade para upsell do Mastermind.',
    closerNotes: [
      {
        id: 'n1',
        date: '18/08 10:15',
        text: 'Abordada no café. Demonstrou grande interesse em migrar alunos particulares para turmas premium.',
        closerName: 'Closer Lucas'
      }
    ]
  },
  {
    id: 'rise-vip-002',
    name: 'Dr. Roberto Magalhães',
    email: 'roberto@idiomaselite.com.br',
    phone: '(21) 99887-1122',
    instagram: '@prof.robertomagalhaes',
    level: 'VIP', // VIP + Mentorado = Crachá ESPECIAL
    status: 'CONFIRMED',
    isPresent: true,
    checkInTime: '08:30',
    isMentee: true,
    nearRenewal: false,
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    expertNote: 'Ingresso VIP / Mentorado de Alta Performance. Possui escola física com 300 alunos em Niterói e quer digitalizar totalmente.',
    closerNotes: []
  },
  {
    id: 'rise-vip-003',
    name: 'Fernanda Lima Alencar',
    email: 'fernanda@teachersclub.com',
    phone: '(19) 97112-3344',
    instagram: '@fer.englishcoach',
    level: 'VIP', // VIP + NÃO Mentorada = Crachá VIP Dourado (Lead Quente!)
    status: 'CONFIRMED',
    isPresent: true,
    checkInTime: '08:50',
    isMentee: false,
    nearRenewal: false,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    expertNote: 'Ingresso VIP (AINDA NÃO É MENTORADA!). Lead quentíssima de alta renda. Esteve no evento anterior no Silver e agora subiu para VIP. Abordagem prioritária para Pitch da Mentoria.',
    closerNotes: []
  },
  {
    id: 'rise-patro-001',
    name: 'Henrique Flexge (Patrocinador)',
    email: 'henrique@flexge.com',
    phone: '(11) 97777-8888',
    instagram: '@flexge.oficial',
    level: 'VIP',
    isSponsor: true, // Patrocinador = Crachá ESPECIAL
    status: 'CONFIRMED',
    isFlexge: true,
    isPresent: true,
    checkInTime: '08:15',
    isMentee: false,
    nearRenewal: false,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    expertNote: 'Patrocinador Oficial do Evento (Flexge Platform). Conexão estratégica para parcerias e integração com alunos VIP.',
    closerNotes: []
  },
  {
    id: 'rise-vip-004',
    name: 'Juliana Paes Ferreira',
    email: 'juliana.paes@englishflow.com',
    phone: '(31) 99123-4567',
    instagram: '@ju.englishflow',
    level: 'VIP', // VIP + Mentorada = Crachá ESPECIAL
    status: 'CONFIRMED',
    isFlexge: true,
    isPresent: false,
    checkInTime: null,
    isMentee: true,
    nearRenewal: true,
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    expertNote: 'Ingresso VIP / Mentorada ativa há 1 ano (Contrato vence mês que vem!). Abordar no Pitch com oferta de renovação.',
    closerNotes: []
  },
  {
    id: 'rise-slv-001',
    name: 'Marcelo Augusto Prado',
    email: 'marcelo.prado@polyglot.com.br',
    phone: '(41) 98844-5566',
    instagram: '@marceloprado.esl',
    level: 'SILVER', // SILVER = Crachá SILVER Prata
    status: 'CONFIRMED',
    isMeteoric: true,
    isPresent: true,
    checkInTime: '09:10',
    isMentee: false,
    nearRenewal: false,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    expertNote: 'Ingresso SILVER (Comprou no Meteórico). Professor autônomo querendo lotar agenda. Apresentar case da Mentoria Rise de Entrada.',
    closerNotes: []
  },
  {
    id: 'rise-slv-002',
    name: 'Camila Albuquerque',
    email: 'camila@teflacademy.com.br',
    phone: '(81) 99554-2211',
    instagram: '@camila.tefl',
    level: 'SILVER',
    status: 'CONFIRMED',
    isPresent: false,
    checkInTime: null,
    isMentee: false,
    nearRenewal: false,
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    expertNote: 'Ingresso SILVER. Embaixadora em Pernambuco. Alvo para mentoria.',
    closerNotes: []
  }
];
