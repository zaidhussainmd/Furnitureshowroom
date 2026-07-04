import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    // Validate parameters
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required parameters (id, status)' }, { status: 400 });
    }

    if (!['new', 'contacted', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Perform update in Supabase enquiries table
    const { data: updatedEnquiry, error } = await supabaseAdmin
      .from('enquiries')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update status error:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedEnquiry,
    });
  } catch (err) {
    console.error('API update-enquiry-status error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
