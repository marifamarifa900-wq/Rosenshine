-- ============================================================
-- KØR DENNE SQL I SUPABASE SQL EDITOR
-- Strammer sikkerheden så kun ordrer kan indsættes via browser
-- Læsning og opdatering kræver service_role nøgle (kun server)
-- ============================================================

-- Fjern de gamle åbne politikker
drop policy if exists "Alle kan læse" on ordrer;
drop policy if exists "Alle kan opdatere" on ordrer;

-- Behold kun indsæt-politikken (til checkout)
-- "Alle kan indsætte" forbliver aktiv

-- Tilføj rate limiting via en simpel check (max 10 ordrer per minut per IP er ikke muligt i RLS,
-- men vi begrænser feltstørrelser for at forhindre spam)
alter table ordrer
  alter column fornavn type varchar(100),
  alter column efternavn type varchar(100),
  alter column email type varchar(200),
  alter column adresse type varchar(300),
  alter column hilsen_tekst type varchar(500);
