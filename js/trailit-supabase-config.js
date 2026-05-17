(function () {
  const DEFAULT_PHOTO_BUCKET = "trail-photos";
  const DEFAULT_DATA_MODE = "mock";
  const DATA_MODE_STORAGE_KEY = "trailit.dataMode.v1";

  function readEnv() {
    return window.TRAILIT_ENV || {};
  }

  function readMeta(name) {
    const element = document.querySelector(`meta[name="${name}"]`);
    return element ? element.getAttribute("content") || "" : "";
  }

  function normalizeMode(mode) {
    return mode === "supabase" ? "supabase" : DEFAULT_DATA_MODE;
  }

  function readStoredMode() {
    try {
      return localStorage.getItem(DATA_MODE_STORAGE_KEY) || "";
    } catch (error) {
      return "";
    }
  }

  function readQueryMode() {
    try {
      return new URLSearchParams(window.location.search).get("dataMode") || "";
    } catch (error) {
      return "";
    }
  }

  function isDevToggleEnabled() {
    const host = window.location.hostname;
    const env = readEnv();
    const query = new URLSearchParams(window.location.search);
    return Boolean(
      env.enableDataModeToggle ||
      query.get("trailitDev") === "1" ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === ""
    );
  }

  function getConfig() {
    const env = readEnv();
    const dataMode = normalizeMode(
      readQueryMode() ||
      readStoredMode() ||
      env.dataMode ||
      readMeta("trailit:data-mode")
    );
    const supabaseUrl = env.supabaseUrl || readMeta("trailit:supabase-url");
    const supabasePublishableKey = env.supabasePublishableKey || readMeta("trailit:supabase-publishable-key");
    const supabasePhotoBucket = env.supabasePhotoBucket || readMeta("trailit:supabase-photo-bucket") || DEFAULT_PHOTO_BUCKET;

    return {
      dataMode,
      supabaseUrl,
      supabasePublishableKey,
      supabasePhotoBucket,
      isSupabaseConfigured: Boolean(supabaseUrl && supabasePublishableKey),
      isDevToggleEnabled: isDevToggleEnabled()
    };
  }

  function setDataMode(mode) {
    const nextMode = normalizeMode(mode);
    try {
      localStorage.setItem(DATA_MODE_STORAGE_KEY, nextMode);
    } catch (error) {
      window.TRAILIT_ENV = { ...readEnv(), dataMode: nextMode };
    }
    return nextMode;
  }

  function createClient() {
    const config = getConfig();
    if (!config.isSupabaseConfigured || !window.supabase?.createClient) {
      return null;
    }

    return window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "implicit"
      }
    });
  }

  window.TrailItSupabase = {
    getConfig,
    setDataMode,
    createClient
  };
})();
