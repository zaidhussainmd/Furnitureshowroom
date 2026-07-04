import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppNotification, sendEmailNotifications } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      enquiryNumber,
      productName,
      customerName,
      customerPhone,
      customerEmail,
      message,
      preferredContact,
    } = body;

    // Validate request body
    if (
      !enquiryNumber ||
      !productName ||
      !customerName ||
      !customerPhone ||
      !customerEmail ||
      !preferredContact
    ) {
      return NextResponse.json(
        { error: 'Missing required payload parameters' },
        { status: 400 }
      );
    }

    // Trigger notifications asynchronously
    await Promise.all([
      sendWhatsAppNotification({
        enquiryNumber,
        productName,
        customerName,
        customerPhone,
        customerEmail,
        message: message || '',
        preferredContact,
      }),
      sendEmailNotifications({
        enquiryNumber,
        productName,
        customerName,
        customerPhone,
        customerEmail,
        message: message || '',
        preferredContact,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API error sending notifications:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
