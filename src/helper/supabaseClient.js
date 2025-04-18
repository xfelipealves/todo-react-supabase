import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://tzpvaoovmiwicbpfjunc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cHZhb292bWl3aWNicGZqdW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDA2NjcsImV4cCI6MjA2MDUxNjY2N30.MB5fu1CIOzN_AUnwTYm0YaqCYnoSjacHhCj388zQnwM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;