const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error, count } = await supabase
    .from("luu_but")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(0, 11);
    
  console.log({ error, count, dataLength: data?.length });
}
test();
