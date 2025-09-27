import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      configured: isSupabaseConfigured,
      mode: isSupabaseConfigured ? 'real' : 'demo'
    });
  } catch (error) {
    console.error('Config check error:', error);
    return NextResponse.json({
      success: false,
      configured: false,
      mode: 'demo',
      error: 'Failed to check configuration'
    }, { status: 500 });
  }
}
