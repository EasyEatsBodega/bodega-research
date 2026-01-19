import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateAnalysis, calculateOverallScore } from "@/lib/anthropic";
import type { RawNotes } from "@/types";

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

    // Parse FormData
    const formData = await request.formData();
    const projectName = formData.get("projectName") as string;
    const rawNotesJson = formData.get("rawNotes") as string;
    const brandImage = formData.get("brandImage") as File | null;

    const rawNotes: RawNotes = JSON.parse(rawNotesJson);

    // Validate input
    if (!projectName || !rawNotes) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      !rawNotes.aisle1_pmf ||
      !rawNotes.aisle2_uiux ||
      !rawNotes.aisle3_general ||
      !rawNotes.aisle4_sentiment
    ) {
      return NextResponse.json(
        { success: false, error: "All aisles must be filled" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    let brandImageUrl: string | null = null;

    // Upload brand image if provided
    if (brandImage && brandImage.size > 0) {
      const fileExt = brandImage.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `brand-images/${fileName}`;

      const { error: uploadError } = await adminClient.storage
        .from("public-infographics")
        .upload(filePath, brandImage, {
          contentType: brandImage.type,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
      } else {
        const { data: urlData } = adminClient.storage
          .from("public-infographics")
          .getPublicUrl(filePath);
        brandImageUrl = urlData.publicUrl;
      }
    }

    // Generate AI analysis
    console.log(`Generating analysis for: ${projectName}`);
    const aiData = await generateAnalysis(projectName, rawNotes);

    // Calculate overall score
    const overallScore = calculateOverallScore(aiData.publicReceipt);
    aiData.publicReceipt.scores.overall = overallScore;

    // Save to database
    const { data: review, error: dbError } = await adminClient
      .from("reviews")
      .insert({
        project_name: projectName,
        brand_image_url: brandImageUrl,
        raw_notes: rawNotes,
        ai_data: aiData,
        rating_score: overallScore,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed to save review" },
        { status: 500 }
      );
    }

    // TODO: Generate PDFs and upload to storage (Phase 7)
    // const { infographicUrl, reportUrl } = await generatePDFs(review);

    return NextResponse.json({
      success: true,
      data: {
        review,
        message: "Review generated successfully",
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);

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
