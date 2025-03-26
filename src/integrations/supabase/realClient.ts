import { createClient } from '@supabase/supabase-js';

// Usar valores diretos para resolver o problema imediato
const supabaseUrl = 'https://invdcmopnzjnrpmscszr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImludmRjbW9wbnpqbnJwbXNjc3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTE4MTYsImV4cCI6MjA1ODQ4NzgxNn0.388kcHSoyUTlYwBnMVyS8u8DJxi4NEuu8uFC8w01J6U';

// Crie o cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
