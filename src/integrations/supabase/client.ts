import { createClient } from '@supabase/supabase-js';

// Client-side configuration (for browser)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Server-side configuration (for server functions)
const createServerClient = () => {
  const url = process.env.SUPABASE_DATABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables for server');
  }
  
  return createClient(url, key);
};

export default supabase;
export { createServerClient };