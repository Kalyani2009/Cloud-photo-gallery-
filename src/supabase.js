import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tclxexuufiecobiqsoxu.supabase.co/rest/v1/";
const supabaseKey = "sb_publishable_Y1Iu07EZscmt6_fnKOW6LQ_9_EuMlda";

export const supabase = createClient(supabaseUrl, supabaseKey);
