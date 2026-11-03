import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  console.log(
  "Supabase key loaded:",
  Boolean(supabasePublishableKey)
);

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);