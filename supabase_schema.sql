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
  level TEXT NOT NULL CHECK (level IN ('VIP', 'SILVER', 'ESPECIAL')),
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

-- 3. Habilitar RLS e Permissões Públicas (Para o evento funcionar com chave anon)
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closer_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso Leitura e Escrita Attendees" ON public.attendees;
CREATE POLICY "Acesso Leitura e Escrita Attendees" ON public.attendees FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso Leitura e Escrita Closer Notes" ON public.closer_notes;
CREATE POLICY "Acesso Leitura e Escrita Closer Notes" ON public.closer_notes FOR ALL USING (true) WITH CHECK (true);

-- 4. Inserção dos Dados Iniciais de Exemplo (Seed Data)
INSERT INTO public.attendees (id, name, email, phone, instagram, level, status, is_flexge, is_present, check_in_time, is_mentee, near_renewal, photo_url, expert_note) VALUES
('rise-vip-001', 'Carolina Santos Mendes', 'carolina.mendes@englishteach.com', '(11) 98765-4321', '@carol.englishtips', 'VIP', 'CONFIRMED', true, true, '08:45', true, true, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'Professora de Business English em expansão. Faturando R$ 15k/mês. Quer criar um infoproduto High-Ticket. Muito engajada, prioridade alta para upsell da mentoria Mastermind.'),
('rise-esp-001', 'Dr. Roberto Magalhães', 'roberto@idiomaselite.com.br', '(21) 99887-1122', '@prof.robertomagalhaes', 'ESPECIAL', 'CONFIRMED', false, true, '08:30', true, false, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80', 'Palestrante Convidado / Conexão Estratégica da Ana. Possui escola física com 300 alunos em Niterói e quer digitalizar totalmente. Perfil para oferta da Mentoria Individual.'),
('rise-vip-002', 'Juliana Paes Ferreira', 'juliana.paes@englishflow.com', '(31) 99123-4567', '@ju.englishflow', 'VIP', 'CONFIRMED', true, false, NULL, true, true, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', 'Mentorada ativa há 1 ano (Contrato vence mês que vem!). Excelente aluna, recomendou 3 colegas. Abordar no Pitch com oferta especial de renovação de 2 anos.'),
('rise-slv-001', 'Marcelo Augusto Prado', 'marcelo.prado@polyglot.com.br', '(41) 98844-5566', '@marceloprado.esl', 'SILVER', 'CONFIRMED', false, true, '09:10', false, false, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'Comprou no Meteórico! É professor autonômo querendo lotar agenda. Sente muita insegurança na cobrança. Apresentar case da Mentoria Rise de Entrada.'),
('rise-vip-003', 'Fernanda Lima Alencar', 'fernanda@teachersclub.com', '(19) 97112-3344', '@fer.englishcoach', 'VIP', 'CONFIRMED', false, true, '08:50', false, false, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80', 'Lead quente de alta renda. Esteve no evento anterior no Silver e agora subiu para VIP. Muito interessada em implementar a metodologia de vendas no Instagram.'),
('rise-esp-002', 'Camila Albuquerque', 'camila@teflacademy.com.br', '(81) 99554-2211', '@camila.tefl', 'ESPECIAL', 'CONFIRMED', false, false, NULL, true, true, 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80', 'Embaixadora do evento em Pernambuco. Mentorada pronta para upgrade de grupo de negócios.'),
('rise-slv-002', 'Thiago Oliveira Souza', 'thiago.souza@talkmaster.com', '(11) 96333-8899', '@thiago.talkmaster', 'SILVER', 'CONFIRMED', false, false, NULL, false, false, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'Professor de escola tradicional querendo transicionar para digital. Ótimo perfil para mentoria de alavancagem.')
ON CONFLICT (id) DO NOTHING;
