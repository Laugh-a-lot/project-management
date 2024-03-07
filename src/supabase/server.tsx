import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )// Or throw an error for missing variables
