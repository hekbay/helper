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
  level: TicketLevel;
  isSponsor?: boolean;
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
 * Calcula o crachá físico entregue na recepção e exibido no QR Code:
 * - ESPECIAL (Azul Safira): Se for Patrocinador OU (Ingresso VIP + Mentorado)
 * - VIP (Dourado): Ingresso VIP que AINDA NÃO é mentorado
 * - SILVER (Prata): Ingresso SILVER
 */
export function getBadgeLevel(attendee: Attendee): BadgeLevel {
  if (attendee.isSponsor || (attendee.level === 'VIP' && attendee.isMentee)) {
    return 'ESPECIAL';
  }
  return attendee.level;
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
