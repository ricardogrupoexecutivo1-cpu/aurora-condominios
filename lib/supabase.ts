import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://egzbjywhrmzfisuhxugk.supabase.co";
const supabaseKey = "sb_publishable_7k5DOGw8zaHtUQnOJup8IA_N-TlKsYA";

export const supabase = createClient(supabaseUrl, supabaseKey);