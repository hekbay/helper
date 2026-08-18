export type TicketLevel = 'VIP' | 'SILVER';
export type BadgeLevel = 'VIP' | 'SILVER' | 'ESPECIAL';
export type ConfirmationStatus = 'CONFIRMED' | 'AWAITING';

export interface CloserNote {
  id: string;
  date: string;
  text: string;
  closerName: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  instagram: string;
  level: TicketLevel;      // 'VIP' ou 'SILVER'
  isSpecial?: boolean;     // Marcação 'É ESPECIAL?' (para Ingressos VIP)
  isSponsor?: boolean;     // Marcação 'Patrocinador?'
  status: ConfirmationStatus;
  isFlexge?: boolean;
  isMeteoric?: boolean;
  isPresent: boolean;
  checkInTime?: string | null;
  isMentee: boolean;
  nearRenewal: boolean;
  photoUrl: string;
  expertNote: string;
  closerNotes: CloserNote[];
}

/**
 * Lógica oficial do evento para o Crachá entregue na recepção e no QR Code:
 * 1. Patrocinador? SIM -> Crachá Especial Azul
 * 2. Ingresso == SILVER -> Crachá SILVER
 * 3. Ingresso == VIP:
 *    - É ESPECIAL? SIM -> Crachá Especial Azul
 *    - É ESPECIAL? NÃO -> Crachá VIP (Amarelo/Dourado)
 */
export function getBadgeLevel(attendee: Attendee): BadgeLevel {
  if (attendee.isSponsor) {
    return 'ESPECIAL';
  }
  if (attendee.level === 'SILVER') {
    return 'SILVER';
  }
  // Ingresso VIP
  if (attendee.isSpecial) {
    return 'ESPECIAL';
  }
  return 'VIP';
}

export type UserRole = 'CLOSER' | 'RECEPCAO' | null;

export interface UserSession {
  role: UserRole;
  userName?: string;
  loggedInAt?: string;
}

export const BADGE_COLORS = {
  VIP: '#F59E0B',
  SILVER: '#94A3B8',
  ESPECIAL: '#2563EB'
} as const;
