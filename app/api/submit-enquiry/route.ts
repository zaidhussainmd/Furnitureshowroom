import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      productName,
      customerName,
      customerPhone,
      customerEmail,
      message,
      preferredContact,
    } = body;

    // Validate inputs
    if (!productName || !customerName || !customerPhone || !customerEmail || !preferredContact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique MC#### enquiry number
    let enquiryNumber = 'MC1001';

    try {
      // Fetch the latest enquiry number ordered by created_at desc
      const { data, error } = await supabaseAdmin
        .from('enquiries')
        .select('enquiry_number')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('Error reading latest enquiry number from Supabase, defaulting to first:', error);
      } else if (data && data.length > 0) {
        const lastNumberStr = data[0].enquiry_number; // e.g. "MC1005"
        const lastDigits = parseInt(lastNumberStr.replace('MC', ''), 10);
        if (!isNaN(lastDigits)) {
          enquiryNumber = `MC${lastDigits + 1}`;
        }
      }
    } catch (e) {
      console.error('Failed to resolve database sequence:', e);
    }

    // Insert new enquiry row
    const { data: newEnquiry, error: insertError } = await supabaseAdmin
      .from('enquiries')
      .insert({
        enquiry_number: enquiryNumber,
        product_id: productId || null,
        product_name: productName,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        message: message || '',
        preferred_contact: preferredContact,
        status: 'new',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insertion error:', insertError);
      return NextResponse.json({ error: 'Database saving failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      enquiry_number: enquiryNumber,
      data: newEnquiry,
    });
  } catch (err) {
    console.error('API submit-enquiry error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
