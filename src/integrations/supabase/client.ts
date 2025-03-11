import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qrkovwuraehejkiiwhbi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya292d3VyYWVoZWpraWl3aGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDg1NDMsImV4cCI6MjA1NTk4NDU0M30.FS3qfzl55TQKnorMfJkHB9j5wzx-sQTKiqx__eBKMpk";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage
    },
    global: {
      headers: {
        'x-application-name': 'leadly'
      }
    }
  }
);

// Add storage-related helpers to safely handle results
export const handleError = <T>(
  result: { data: T | null; error: Error | null },
  errorMessage: string = "An error occurred"
): T => {
  if (result.error) {
    console.error(errorMessage, result.error);
    throw new Error(`${errorMessage}: ${result.error.message}`);
  }
  
  if (result.data === null) {
    throw new Error(`${errorMessage}: No data returned`);
  }
  
  return result.data;
};

// Helper to safely retrieve data from Supabase queries
export const safeQueryResult = <T>(result: { data: T | null; error: any }): T | null => {
  if (result.error) {
    console.error("Supabase query error:", result.error);
    return null;
  }
  return result.data;
};

// Helper to check if an item exists in query result
export const dataExists = <T>(result: { data: T | null; error: any }): boolean => {
  return !result.error && result.data !== null;
};
