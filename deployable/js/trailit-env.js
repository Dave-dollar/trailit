// Static TrailIt runtime configuration.
// Keep this in mock mode until Supabase schema, RLS, storage, and repository code are ready.
// Do not place Supabase secret or service-role keys in browser files.
window.TRAILIT_ENV = window.TRAILIT_ENV || {
  dataMode: "mock",
  enableDataModeToggle: true,
  supabaseUrl: "https://lofevketpoasiuxygtyd.supabase.co",
  supabasePublishableKey: "sb_publishable_s17qi_45p1MkWkWQEtnr6Q_EMjPSAGB",
  supabasePhotoBucket: "trail-photos"
};
