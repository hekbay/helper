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
  level: BadgeLevel;
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

export type UserRole = 'CLOSER' | 'RECEPCAO' | null;

export interface UserSession {
  role: UserRole;
  userName?: string;
  loggedInAt?: string;
}

// Runtime helper constants to ensure ES Module export presence
export const BADGE_COLORS = {
  VIP: '#F59E0B',
  SILVER: '#94A3B8',
  ESPECIAL: '#2563EB' // Azul Safira
} as const;
