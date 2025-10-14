import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert submission into database
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name,
          email,
          service: service || null,
          message,
          status: "new",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving contact submission:", error);
      return NextResponse.json(
        { error: "Failed to submit form" },
        { status: 500 }
      );
    }

    // TODO: Send email notification to admin
    // You can integrate with services like Resend, SendGrid, or use Supabase Edge Functions

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
