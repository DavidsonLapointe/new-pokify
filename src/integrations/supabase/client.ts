

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qrkovwuraehejkiiwhbi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya292d3VyYWVoZWpraWl3aGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDg1NDMsImV4cCI6MjA1NTk4NDU0M30.FS3qfzl55TQKnorMfJkHB9j5wzx-sQTKiqx__eBKMpk";

// Create a custom fetch implementation to troubleshoot requests
const customFetch = (url: RequestInfo | URL, options?: RequestInit) => {
  console.log(`Supabase request to ${url instanceof URL ? url.toString() : url}`);
  return fetch(url, options);
};

// Use the customFetch for all Supabase requests for debugging
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: customFetch
    }
  }
);
