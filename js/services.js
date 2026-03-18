// ============================================================
//  RoseNShine – Services: Supabase + EmailJS
// ============================================================

// ===== SUPABASE =====
async function gemOrdreIDatabase(ordre) {
  try {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/ordrer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': CONFIG.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(ordre)
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Supabase fejl:', err);
      return null;
    }
    const data = await res.json();
    return data[0] || data;
  } catch (e) {
    console.error('Database fejl:', e);
    return null;
  }
}

async function hentAlleOrdrer() {
  try {
    const res = await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/ordrer?order=oprettet_dato.desc`,
      {
        headers: {
          'apikey': CONFIG.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
        }
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error('Hent ordrer fejl:', e);
    return [];
  }
}

async function opdaterOrdreStatus(ordreId, status) {
  try {
    const res = await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/ordrer?id=eq.${ordreId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': CONFIG.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ betalings_status: status })
      }
    );
    return res.ok;
  } catch (e) {
    return false;
  }
}

// ===== EMAILJS =====
async function sendOrdreEmail(ordre) {
  // Springer over hvis EmailJS ikke er konfigureret
  if (!CONFIG.EMAILJS_PUBLIC_KEY || !CONFIG.EMAILJS_SERVICE_ID || !CONFIG.EMAILJS_TEMPLATE_ID) {
    console.log('EmailJS ikke konfigureret – email springes over');
    return false;
  }
  try {
    const produktListe = ordre.produkter
      .map(p => `${p.name} x${p.qty} – ${p.price * p.qty} kr.`)
      .join('\n');

    const payload = {
      service_id: CONFIG.EMAILJS_SERVICE_ID,
      template_id: CONFIG.EMAILJS_TEMPLATE_ID,
      user_id: CONFIG.EMAILJS_PUBLIC_KEY,
      template_params: {
        to_name: ordre.fornavn,
        to_email: ordre.email,
        ordre_nr: ordre.ordre_nr,
        produkter: produktListe,
        subtotal: ordre.subtotal + ' kr.',
        levering: ordre.leverings_pris + ' kr. (' + ordre.leverings_metode + ')',
        hilsen_pris: ordre.hilsen_valgt ? '15 kr.' : '0 kr.',
        total: ordre.total + ' kr.',
        adresse: `${ordre.adresse}, ${ordre.postnr} ${ordre.by}`,
        hilsen_tekst: ordre.hilsen_tekst || '–'
      }
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (e) {
    console.error('Email fejl:', e);
    return false;
  }
}
