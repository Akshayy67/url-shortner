#!/usr/bin/env node

/**
 * Database Setup Script for URL Shortener
 * This script will test the Supabase connection and set up the database schema
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 URL Shortener Database Setup');
console.log('================================');

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not configured');
  console.log('Please update your .env.local file with your Supabase project URL');
  process.exit(1);
}

if (!serviceRoleKey || serviceRoleKey === 'your_supabase_service_role_key') {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not configured');
  console.log('Please update your .env.local file with your Supabase service role key');
  process.exit(1);
}

console.log('✅ Environment variables configured');
console.log(`📍 Supabase URL: ${supabaseUrl}`);

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testConnection() {
  console.log('\n🔍 Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('urls')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "urls" does not exist')) {
        console.log('⚠️  Database tables not found - need to run schema setup');
        return false;
      } else {
        console.error('❌ Database connection failed:', error.message);
        return false;
      }
    }
    
    console.log('✅ Database connection successful');
    console.log('✅ Tables exist and are accessible');
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function setupSchema() {
  console.log('\n📋 Setting up database schema...');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error && !error.message.includes('already exists')) {
        console.error(`❌ Failed to execute statement ${i + 1}:`, error.message);
        console.log('Statement:', statement);
        return false;
      }
    }
    
    console.log('✅ Database schema setup completed');
    return true;
  } catch (error) {
    console.error('❌ Schema setup failed:', error.message);
    return false;
  }
}

async function insertSampleData() {
  console.log('\n📊 Checking for existing data...');
  
  try {
    const { data: existingUrls, error } = await supabase
      .from('urls')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Failed to check existing data:', error.message);
      return false;
    }
    
    if (existingUrls && existingUrls.length > 0) {
      console.log('✅ Database already contains data');
      return true;
    }
    
    console.log('📝 Inserting sample data...');
    
    const sampleUrls = [
      {
        original_url: 'https://github.com/vercel/next.js',
        short_code: 'nextjs',
        custom_alias: 'nextjs',
        click_count: 42
      },
      {
        original_url: 'https://supabase.com/docs',
        short_code: 'supabase',
        custom_alias: null,
        click_count: 15
      },
      {
        original_url: 'https://tailwindcss.com/docs',
        short_code: 'tailwind',
        custom_alias: 'tailwind-docs',
        click_count: 8
      }
    ];
    
    const { error: insertError } = await supabase
      .from('urls')
      .insert(sampleUrls);
    
    if (insertError) {
      console.error('❌ Failed to insert sample data:', insertError.message);
      return false;
    }
    
    console.log('✅ Sample data inserted successfully');
    return true;
  } catch (error) {
    console.error('❌ Sample data insertion failed:', error.message);
    return false;
  }
}

async function main() {
  try {
    // Test connection first
    const connectionOk = await testConnection();
    
    if (!connectionOk) {
      console.log('\n🔧 Attempting to set up database schema...');
      console.log('Note: This requires your Supabase project to have the necessary permissions');
      console.log('If this fails, please run the SQL from supabase-schema.sql manually in your Supabase dashboard');
      
      // Try to setup schema (this might fail if we don't have the right permissions)
      const schemaOk = await setupSchema();
      
      if (!schemaOk) {
        console.log('\n📋 Manual Setup Required:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the contents of supabase-schema.sql');
        console.log('4. Run the SQL to create tables and functions');
        console.log('5. Restart this script');
        process.exit(1);
      }
    }
    
    // Insert sample data
    await insertSampleData();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('🚀 Your URL shortener is now ready to use with real database');
    console.log('💡 Start your development server: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
