// ============================================================
//  RoseNShine – Konfiguration
//  Indsæt dine egne nøgler her
// ============================================================

const CONFIG = {

  // --- STRIPE ---
  // 1. Gå til https://dashboard.stripe.com/test/apikeys
  // 2. Kopiér "Publishable key" (starter med pk_test_ eller pk_live_)
  STRIPE_PUBLIC_KEY: 'pk_test_INDSÆT_DIN_STRIPE_NØGLE_HER',

  // --- SUPABASE ---
  // 1. Gå til https://supabase.com → dit projekt → Settings → API
  // 2. Kopiér "Project URL" og "anon public" nøgle
  SUPABASE_URL: 'https://INDSÆT_DIN_SUPABASE_URL.supabase.co',
  SUPABASE_ANON_KEY: 'INDSÆT_DIN_SUPABASE_ANON_NØGLE_HER',

  // --- EMAILJS ---
  // 1. Gå til https://emailjs.com → Account → API Keys
  // 2. Opret en Email Service og en Template
  EMAILJS_PUBLIC_KEY: 'INDSÆT_DIN_EMAILJS_PUBLIC_KEY',
  EMAILJS_SERVICE_ID: 'INDSÆT_DIN_SERVICE_ID',       // fx "service_abc123"
  EMAILJS_TEMPLATE_ID: 'INDSÆT_DIN_TEMPLATE_ID',     // fx "template_xyz789"

};
