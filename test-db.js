const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🔍 Testing Supabase database connection...');
console.log('📍 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

async function testDatabase() {
  try {
    const { data, error } = await supabase.from('urls').select('*').limit(1);
    
    if (error) {
      console.log('❌ Database error:', error.message);
      if (error.message.includes('relation "urls" does not exist')) {
        console.log('💡 The database schema has not been set up yet.');
        console.log('💡 Please run the SQL from supabase-schema.sql in your Supabase dashboard.');
        return false;
      }
      return false;
    } else {
      console.log('✅ Database connection successful!');
      console.log('✅ Found', data.length, 'URLs in database');
      console.log('✅ Real database is working');
      return true;
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    return false;
  }
}

testDatabase();
