// Storage Keys
export const STORAGE_KEY = 'omninote-recent-docs';

// Database Tables
export const NOTES_TABLE = 'notes';
export const NOTE_CONTENTS_TABLE = 'note_contents';
export const PROFILES_TABLE = 'profiles';

// App Metadata
export const APP_NAME = "OmniNote";
export const APP_DEFAULT_TITLE = "OmniNote – Collaborative Notes";
export const APP_TITLE_TEMPLATE = "%s – OmniNote";
export const APP_DESCRIPTION = "Collaborative, offline-first note-taking with real-time sync.";

// Supabase Configuration
// We use getters to ensure these values are read at runtime, not module-load time,
// which is critical for correctly picking up values from process.env after dotenv/config.
export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const getSupabaseConfig = () => ({
  url: process.env.SUPABASE_URL || SUPABASE_URL,
  key: process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY,
});