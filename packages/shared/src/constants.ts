export const WS_PORT = 8080;

// Storage Keys
export const STORAGE_KEY = 'omninote-recent-docs';

// Database Tables
export const NOTES_TABLE = 'notes';
export const NOTE_CONTENTS_TABLE = 'note_contents';

// App Metadata
export const APP_NAME = "OmniNote";
export const APP_DEFAULT_TITLE = "OmniNote – Collaborative Notes";
export const APP_TITLE_TEMPLATE = "%s – OmniNote";
export const APP_DESCRIPTION = "Collaborative, offline-first note-taking with real-time sync.";

// Supabase Configuration
export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const SUPABASE_USER_ID = process.env.SUPABASE_TEST_USER || '';
