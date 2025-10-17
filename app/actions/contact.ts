'use server';

import { createClient } from "@/lib/supabase/server";

export interface ContactFormData {
  name: string;
  email: string;
  service?: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function submitContactForm(
  formData: ContactFormData
): Promise<ContactFormResponse> {
  try {
    const { name, email, service, message } = formData;

    // Validate required fields
    if (!name || !email || !message) {
      return {
        success: false,
        message: "Name, email, and message are required",
        error: "VALIDATION_ERROR",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Invalid email format",
        error: "INVALID_EMAIL",
      };
    }

    const supabase = await createClient();

    // Insert submission into database
    const { error } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        service: service || null,
        message,
        status: "new",
      });

    if (error) {
      console.error("Error saving contact submission:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      
      return {
        success: false,
        message: "Failed to submit form. Please try again.",
        error: "DATABASE_ERROR",
      };
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: "INTERNAL_ERROR",
    };
  }
}
