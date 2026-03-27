import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ceuexjfzwbcwcmngekyw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldWV4amZ6d2Jjd2Ntbmdla3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjAwOTcsImV4cCI6MjA4OTkzNjA5N30.XrdB7pjvELPP5lESy6RGy3PAJbSNXWwYCWNSiWrDMsU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
