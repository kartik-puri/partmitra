import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.NOTIFICATION_EMAIL;

    if (!apiKey || !to) {
      return NextResponse.json(
        { error: "Email configuration missing" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "PartMitra <onboarding@resend.dev>",
      to: [to],
      subject: body.subject || "PartMitra Notification",
      text: body.message || "You have a new PartMitra notification.",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch {
    return NextResponse.json(
      { error: "Unable to send email" },
      { status: 500 }
    );
  }
}
