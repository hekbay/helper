import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Attendee, UserSession, UserRole } from '../types/index';
import { INITIAL_ATTENDEES } from '../data/mockAttendees';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  attendees: Attendee[];
  userSession: UserSession;
  isSupabaseActive: boolean;
  login: (role: UserRole, userName?: string) => void;
  logout: () => void;
  toggleCheckIn: (id: string) => void;
  updateAttendee: (updated: Attendee) => void;
  addCloserNote: (attendeeId: string, text: string, closerName: string) => void;
  importAttendees: (newAttendees: Attendee[]) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY_ATTENDEES = 'helper_rise_attendees_v2';
const STORAGE_KEY_SESSION = 'helper_rise_session_v2';

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
            email: item.email || '',
            phone: item.phone || '',
            instagram: item.instagram || '',
            level: item.level as any,
            isSpecial: item.is_special,
            isSponsor: item.is_sponsor,
            status: item.status as any,
            isFlexge: item.is_flexge,
            isMeteoric: item.is_meteoric,
            isPresent: item.is_present,
            checkInTime: item.check_in_time,
            isMentee: item.is_mentee,
            nearRenewal: item.near_renewal,
            photoUrl: item.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            expertNote: item.expert_note || '',
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
    const newCheckInTime = newIsPresent
      ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : null;

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
            email: updated.email,
            phone: updated.phone,
            instagram: updated.instagram,
            level: updated.level,
            is_mentee: updated.isMentee,
            near_renewal: updated.nearRenewal,
            expert_note: updated.expertNote
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

  return (
    <AppContext.Provider
      value={{
        attendees,
        userSession,
        isSupabaseActive: isSupabaseConfigured,
        login,
        logout,
        toggleCheckIn,
        updateAttendee,
        addCloserNote,
        importAttendees,
        resetToDefault
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
