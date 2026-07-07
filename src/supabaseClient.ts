import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mgfqstghvrxgywwdezvn.supabase.co'
const supabaseAnonKey = 'sb_publishable_x2Z6kFj71DdN7NC4Jqgxog_CYILlSqz'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)