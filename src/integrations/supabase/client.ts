
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ijtgnadrxgeonhapuanu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqdGduYWRyeGdlb25oYXB1YW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzk5MzgsImV4cCI6MjA2MDc1NTkzOH0.dIWH0MKFNw3ax1Olf-qlXj_G-sOXKsCm_B1P7JS2YLU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
