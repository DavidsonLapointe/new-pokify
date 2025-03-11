
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qrkovwuraehejkiiwhbi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya292d3VyYWVoZWpraWl3aGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDg1NDMsImV4cCI6MjA1NTk4NDU0M30.FS3qfzl55TQKnorMfJkHB9j5wzx-sQTKiqx__eBKMpk";

// Create a custom fetch implementation to troubleshoot requests
const customFetch = (url: RequestInfo | URL, options?: RequestInit) => {
  console.log(`Supabase request to ${url instanceof URL ? url.toString() : url}`);
  if (options?.method) console.log(`Method: ${options.method}`);
  if (options?.headers) console.log(`Headers: ${JSON.stringify(options.headers)}`);
  if (options?.body) {
    try {
      const bodyObj = JSON.parse(options.body.toString());
      console.log(`Request body: ${JSON.stringify(bodyObj, null, 2)}`);
    } catch (e) {
      console.log(`Request body: ${options.body}`);
    }
  }
  
  return fetch(url, options).then(async response => {
    // Clone the response so we can log it without consuming it
    const cloned = response.clone();
    try {
      const text = await cloned.text();
      try {
        const json = JSON.parse(text);
        console.log(`Response: ${JSON.stringify(json, null, 2)}`);
      } catch (e) {
        console.log(`Response: ${text}`);
      }
    } catch (e) {
      console.log('Error logging response');
    }
    return response;
  });
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
