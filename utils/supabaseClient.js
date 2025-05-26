// utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL or Anon Key is missing. Please check your .env.local file."
  );
  // 실제 프로덕션 환경에서는 앱이 제대로 동작하지 않도록 처리하는 것이 좋습니다.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
