-- ========================================================
-- HELPER (Imersão Rise) • Supabase Database Schema
-- Execute este script no SQL Editor do seu projeto Supabase
-- ========================================================

-- 1. Tabela de Participantes (Attendees)
CREATE TABLE IF NOT EXISTS public.attendees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  instagram TEXT,
  level TEXT NOT NULL CHECK (level IN ('VIP', 'SILVER')),
  is_special BOOLEAN DEFAULT FALSE, -- Flag "É ESPECIAL?" (para VIPs)
  is_sponsor BOOLEAN DEFAULT FALSE, -- Flag "Patrocinador?"
  status TEXT DEFAULT 'CONFIRMED',
  is_flexge BOOLEAN DEFAULT FALSE,
  is_meteoric BOOLEAN DEFAULT FALSE,
  is_present BOOLEAN DEFAULT FALSE,
  check_in_time TEXT,
  is_mentee BOOLEAN DEFAULT FALSE,
  near_renewal BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  expert_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Anotações dos Closers (Closer Notes)
CREATE TABLE IF NOT EXISTS public.closer_notes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attendee_id TEXT NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  closer_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar RLS e Permissões Públicas
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closer_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso Leitura e Escrita Attendees" ON public.attendees;
CREATE POLICY "Acesso Leitura e Escrita Attendees" ON public.attendees FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso Leitura e Escrita Closer Notes" ON public.closer_notes;
CREATE POLICY "Acesso Leitura e Escrita Closer Notes" ON public.closer_notes FOR ALL USING (true) WITH CHECK (true);

-- 4. Inserção dos Dados Iniciais (Seed Data com a Lógica do Fluxograma)
INSERT INTO public.attendees (id, name, email, phone, instagram, level, is_special, is_sponsor, status, is_flexge, is_present, check_in_time, is_mentee, near_renewal, photo_url, expert_note) VALUES
('rise-vip-001', 'Carolina Santos Mendes', 'carolina.mendes@englishteach.com', '(11) 98765-4321', '@carol.englishtips', 'VIP', true, false, 'CONFIRMED', true, true, '08:45', true, true, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'Professora de Business English em expansão. VIP com perfil ESPECIAL.'),
('rise-vip-002', 'Dr. Roberto Magalhães', 'roberto@idiomaselite.com.br', '(21) 99887-1122', '@prof.robertomagalhaes', 'VIP', true, false, 'CONFIRMED', false, true, '08:30', true, false, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80', 'Ingresso VIP com perfil ESPECIAL.'),
('rise-vip-003', 'Fernanda Lima Alencar', 'fernanda@teachersclub.com', '(19) 97112-3344', '@fer.englishcoach', 'VIP', false, false, 'CONFIRMED', false, true, '08:50', false, false, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80', 'Ingresso VIP Padrão (CRACHÁ VIP DOURADO). Lead quentíssima de alta renda!'),
('rise-patro-001', 'Henrique Flexge (Patrocinador)', 'henrique@flexge.com', '(11) 97777-8888', '@flexge.oficial', 'VIP', false, true, 'CONFIRMED', true, true, '08:15', false, false, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'Patrocinador Oficial do Evento (Flexge Platform).'),
('rise-slv-001', 'Marcelo Augusto Prado', 'marcelo.prado@polyglot.com.br', '(41) 98844-5566', '@marceloprado.esl', 'SILVER', false, false, 'CONFIRMED', false, true, '09:10', false, false, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'Ingresso SILVER (CRACHÁ SILVER PRATA).')
ON CONFLICT (id) DO NOTHING;
