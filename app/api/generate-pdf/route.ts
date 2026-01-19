import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ReceiptTemplate } from "@/lib/pdf/ReceiptTemplate";
import { ReportTemplate } from "@/lib/pdf/ReportTemplate";
import type { Review } from "@/types";

// Get the base URL for loading static assets
function getBaseUrl(): string {
  // In production, use NEXT_PUBLIC_SITE_URL or VERCEL_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback for local development
  return "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reviewId, type } = body as {
      reviewId: string;
      type: "infographic" | "report";
    };

    if (!reviewId || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the review
    const adminClient = createAdminClient();
    const { data: review, error: fetchError } = await adminClient
      .from("reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (fetchError || !review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // Generate the PDF
    let pdfBuffer: Buffer;
    let fileName: string;
    let bucketName: string;

    const sanitizedName = review.project_name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
    const timestamp = Date.now();
    const baseUrl = getBaseUrl();

    try {
      if (type === "infographic") {
        pdfBuffer = await renderToBuffer(
          ReceiptTemplate({ review: review as Review, baseUrl })
        );
        fileName = `${sanitizedName}-receipt-${timestamp}.pdf`;
        bucketName = "public-infographics";
      } else {
        pdfBuffer = await renderToBuffer(
          ReportTemplate({ review: review as Review })
        );
        fileName = `${sanitizedName}-report-${timestamp}.pdf`;
        bucketName = "private-reports";
      }
    } catch (renderError) {
      console.error("PDF render error:", renderError);
      return NextResponse.json(
        {
          success: false,
          error: `PDF render failed: ${renderError instanceof Error ? renderError.message : 'Unknown render error'}`
        },
        { status: 500 }
      );
    }

    // Upload to Supabase Storage
    const { error: uploadError } = await adminClient.storage
      .from(bucketName)
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to upload PDF" },
        { status: 500 }
      );
    }

    // Get public URL
    let publicUrl: string;
    if (type === "infographic") {
      const { data: urlData } = adminClient.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      publicUrl = urlData.publicUrl;
    } else {
      // For private reports, create a signed URL
      const { data: urlData, error: signError } = await adminClient.storage
        .from(bucketName)
        .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

      if (signError || !urlData) {
        return NextResponse.json(
          { success: false, error: "Failed to generate URL" },
          { status: 500 }
        );
      }
      publicUrl = urlData.signedUrl;
    }

    // Update the review with the PDF URL
    const updateField =
      type === "infographic" ? "infographic_url" : "report_url";
    const { error: updateError } = await adminClient
      .from("reviews")
      .update({ [updateField]: publicUrl })
      .eq("id", reviewId);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        fileName,
        type,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
