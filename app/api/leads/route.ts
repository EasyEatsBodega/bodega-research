import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadNotification } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      projectLink,
      email,
      telegramUsername,
      preferredContact,
      preferredContactOther,
      message,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate preferredContact if "other" is selected
    if (preferredContact === "other" && !preferredContactOther) {
      return NextResponse.json(
        {
          success: false,
          error: "Please specify your preferred contact method",
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        project_link: projectLink || null,
        email,
        telegram_username: telegramUsername || null,
        preferred_contact: preferredContact || "email",
        preferred_contact_other: preferredContactOther || null,
        message: message || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting lead:", error);
      return NextResponse.json(
        { success: false, error: "Failed to submit inquiry" },
        { status: 500 }
      );
    }

    // Send email notification to admin (non-blocking)
    sendLeadNotification({
      name,
      email,
      projectLink: projectLink || undefined,
      telegramUsername: telegramUsername || undefined,
      preferredContact: preferredContact || "email",
      preferredContactOther: preferredContactOther || undefined,
      message: message || undefined,
    }).catch((err) => {
      console.error("Failed to send notification:", err);
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error processing lead submission:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
