import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Attendee, UserSession, UserRole } from '../types/index';
import { INITIAL_ATTENDEES } from '../data/mockAttendees';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  attendees: Attendee[];
  closerNames: string[];
  userSession: UserSession;
  isSupabaseActive: boolean;
  login: (role: UserRole, userName?: string) => void;
  logout: () => void;
  toggleCheckIn: (id: string) => void;
  updateAttendee: (updated: Attendee) => void;
  addCloserNote: (attendeeId: string, text: string, closerName: string) => void;
  importAttendees: (newAttendees: Attendee[]) => void;
  resetToDefault: () => void;
  addAttendee: (attendee: Attendee) => void;
  deleteAttendee: (id: string) => void;
  addCloserName: (name: string) => void;
  removeCloserName: (name: string) => void;
}

const STORAGE_KEY_ATTENDEES = 'helper_rise_attendees_v2';
const STORAGE_KEY_SESSION = 'helper_rise_session_v2';
const STORAGE_KEY_CLOSERS = 'helper_rise_closers_v1';

export const DEFAULT_CLOSER_NAMES = ['Carla', 'Davi', 'Emmy', 'Ricardo', 'Everton'];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attendees, setAttendees] = useState<Attendee[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ATTENDEES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to parse local attendees:', err);
    }
    return INITIAL_ATTENDEES;
  });

  const [userSession, setUserSession] = useState<UserSession>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SESSION);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to parse session:', err);
    }
    return { role: null };
  });

  const [closerNames, setCloserNames] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLOSERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to parse closer names:', err);
    }
    return DEFAULT_CLOSER_NAMES;
  });

  // Supabase Initial Fetch & Sync
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchFromSupabase = async () => {
      try {
        const { data: dbAttendees, error: attError } = await supabase
          .from('attendees')
          .select('*');

        if (attError) {
          console.warn('Supabase fetch error, using local fallback:', attError);
          return;
        }

        if (dbAttendees && dbAttendees.length > 0) {
          const { data: dbNotes } = await supabase
            .from('closer_notes')
            .select('*')
            .order('created_at', { ascending: false });

          const formatted: Attendee[] = dbAttendees.map(item => ({
            id: item.id,
            name: item.name,
            phone: item.phone || '',
            instagram: item.instagram || '',
            level: item.level as any,
            isSponsor: item.is_sponsor ?? false,
            status: item.status as any,
            isPresent: item.is_present,
            checkInTime: item.check_in_time,
            isMentee: item.is_mentee,
            nearRenewal: item.near_renewal,
            photoUrl: item.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            isAccompanied: item.is_accompanied ?? false,
            accompaniedBy: item.accompanied_by || undefined,
            companionName: item.companion_name || '',
            currentMentorship: item.current_mentorship || '',
            cycle: item.cycle || '',
            cycleEndDate: item.cycle_end_date || '',
            mentorshipRemaining: item.mentorship_remaining || '',
            isPaying: item.is_paying ?? false,
            paymentMethod: item.payment_method || undefined,
            installmentValue: item.installment_value || '',
            remainingInstallments: item.remaining_installments ?? undefined,
            mentorshipValue: item.mentorship_value || '',
            amountPaid: item.amount_paid || '',
            creditBalance: item.credit_balance || '',
            offerToMake: item.offer_to_make || '',
            specialCondition: item.special_condition || '',
            closerNotes: (dbNotes || [])
              .filter(n => n.attendee_id === item.id)
              .map(n => ({
                id: n.id,
                date: new Date(n.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
                text: n.text,
                closerName: n.closer_name
              }))
          }));

          setAttendees(formatted);
        }
      } catch (err) {
        console.error('Failed to sync with Supabase:', err);
      }
    };

    fetchFromSupabase();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    const fetchClosersFromSupabase = async () => {
      try {
        const { data, error } = await client.from('closers').select('name').order('name');
        if (error) {
          console.warn('Supabase closers fetch error, using local fallback:', error);
          return;
        }
        if (data && data.length > 0) {
          setCloserNames(data.map(row => row.name));
        }
      } catch (err) {
        console.error('Failed to sync closers with Supabase:', err);
      }
    };

    fetchClosersFromSupabase();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ATTENDEES, JSON.stringify(attendees));
    } catch (err) {
      console.error('Failed to save attendees:', err);
    }
  }, [attendees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(userSession));
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  }, [userSession]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLOSERS, JSON.stringify(closerNames));
    } catch (err) {
      console.error('Failed to save closer names:', err);
    }
  }, [closerNames]);

  const login = (role: UserRole, userName?: string) => {
    const session: UserSession = {
      role,
      userName: userName || (role === 'CLOSER' ? 'Closer Rise' : 'Recepção Barueri'),
      loggedInAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setUserSession(session);
  };

  const logout = () => {
    setUserSession({ role: null });
  };

  const toggleCheckIn = async (id: string) => {
    const target = attendees.find(a => a.id === id);
    if (!target) return;

    const newIsPresent = !target.isPresent;
    const newCheckInTime = newIsPresent ? new Date().toISOString() : null;

    // Optimistic local update
    setAttendees(prev =>
      prev.map(item => (item.id === id ? { ...item, isPresent: newIsPresent, checkInTime: newCheckInTime } : item))
    );

    // Sync with Supabase if available
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('attendees')
          .update({ is_present: newIsPresent, check_in_time: newCheckInTime })
          .eq('id', id);
      } catch (err) {
        console.error('Failed to sync check-in to Supabase:', err);
      }
    }
  };

  const updateAttendee = async (updated: Attendee) => {
    setAttendees(prev => prev.map(item => (item.id === updated.id ? updated : item)));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('attendees')
          .update({
            name: updated.name,
            phone: updated.phone,
            instagram: updated.instagram,
            level: updated.level,
            is_mentee: updated.isMentee,
            near_renewal: updated.nearRenewal,
            is_accompanied: updated.isAccompanied,
            accompanied_by: updated.accompaniedBy,
            companion_name: updated.companionName,
            current_mentorship: updated.currentMentorship,
            cycle: updated.cycle,
            cycle_end_date: updated.cycleEndDate,
            mentorship_remaining: updated.mentorshipRemaining,
            is_paying: updated.isPaying,
            payment_method: updated.paymentMethod,
            installment_value: updated.installmentValue,
            remaining_installments: updated.remainingInstallments,
            mentorship_value: updated.mentorshipValue,
            amount_paid: updated.amountPaid,
            credit_balance: updated.creditBalance,
            offer_to_make: updated.offerToMake,
            special_condition: updated.specialCondition
          })
          .eq('id', updated.id);
      } catch (err) {
        console.error('Failed to update attendee in Supabase:', err);
      }
    }
  };

  const addCloserNote = async (attendeeId: string, text: string, closerName: string) => {
    const newNote = {
      id: 'note_' + Date.now(),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      text,
      closerName: closerName || 'Closer'
    };

    setAttendees(prev =>
      prev.map(item => {
        if (item.id === attendeeId) {
          return {
            ...item,
            closerNotes: [newNote, ...(item.closerNotes || [])]
          };
        }
        return item;
      })
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('closer_notes').insert({
          attendee_id: attendeeId,
          text,
          closer_name: closerName || 'Closer'
        });
      } catch (err) {
        console.error('Failed to insert closer note into Supabase:', err);
      }
    }
  };

  const importAttendees = (newAttendees: Attendee[]) => {
    setAttendees(newAttendees);
  };

  const resetToDefault = () => {
    setAttendees(INITIAL_ATTENDEES);
    localStorage.removeItem(STORAGE_KEY_ATTENDEES);
  };

  const addAttendee = async (attendee: Attendee) => {
    setAttendees(prev => [attendee, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('attendees').insert({
          id: attendee.id,
          name: attendee.name,
          phone: attendee.phone,
          instagram: attendee.instagram,
          level: attendee.level,
          is_sponsor: attendee.isSponsor ?? false,
          status: attendee.status,
          is_present: attendee.isPresent,
          check_in_time: attendee.checkInTime,
          is_mentee: attendee.isMentee,
          near_renewal: attendee.nearRenewal,
          photo_url: attendee.photoUrl,
          is_accompanied: attendee.isAccompanied,
          accompanied_by: attendee.accompaniedBy,
          companion_name: attendee.companionName,
          current_mentorship: attendee.currentMentorship,
          cycle: attendee.cycle,
          cycle_end_date: attendee.cycleEndDate,
          mentorship_remaining: attendee.mentorshipRemaining,
          is_paying: attendee.isPaying,
          payment_method: attendee.paymentMethod,
          installment_value: attendee.installmentValue,
          remaining_installments: attendee.remainingInstallments,
          mentorship_value: attendee.mentorshipValue,
          amount_paid: attendee.amountPaid,
          credit_balance: attendee.creditBalance,
          offer_to_make: attendee.offerToMake,
          special_condition: attendee.specialCondition
        });
      } catch (err) {
        console.error('Failed to insert attendee into Supabase:', err);
      }
    }
  };

  const deleteAttendee = async (id: string) => {
    setAttendees(prev => prev.filter(item => item.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('attendees').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete attendee from Supabase:', err);
      }
    }
  };

  const addCloserName = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setCloserNames(prev => (prev.includes(trimmed) ? prev : [...prev, trimmed]));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('closers').insert({ name: trimmed });
      } catch (err) {
        console.error('Failed to insert closer into Supabase:', err);
      }
    }
  };

  const removeCloserName = async (name: string) => {
    setCloserNames(prev => prev.filter(item => item !== name));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('closers').delete().eq('name', name);
      } catch (err) {
        console.error('Failed to delete closer from Supabase:', err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        attendees,
        closerNames,
        userSession,
        isSupabaseActive: isSupabaseConfigured,
        login,
        logout,
        toggleCheckIn,
        updateAttendee,
        addCloserNote,
        importAttendees,
        resetToDefault,
        addAttendee,
        deleteAttendee,
        addCloserName,
        removeCloserName
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
