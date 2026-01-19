import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
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

    const adminClient = createAdminClient();

    // First, get the review to check if it has associated files
    const { data: review, error: fetchError } = await adminClient
      .from("reviews")
      .select("brand_image_url, infographic_url, report_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching review:", fetchError);
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // Delete associated files from storage if they exist
    const filesToDelete: string[] = [];

    if (review.brand_image_url) {
      // Extract file path from URL
      const brandImagePath = review.brand_image_url.split("/public-infographics/")[1];
      if (brandImagePath) {
        filesToDelete.push(brandImagePath);
      }
    }

    if (review.infographic_url) {
      const infographicPath = review.infographic_url.split("/public-infographics/")[1];
      if (infographicPath) {
        filesToDelete.push(infographicPath);
      }
    }

    // Delete files from storage
    if (filesToDelete.length > 0) {
      const { error: storageError } = await adminClient.storage
        .from("public-infographics")
        .remove(filesToDelete);

      if (storageError) {
        console.error("Error deleting files:", storageError);
        // Continue with review deletion even if file deletion fails
      }
    }

    // Delete private report if exists
    if (review.report_url) {
      const reportPath = review.report_url.split("/private-reports/")[1];
      if (reportPath) {
        await adminClient.storage.from("private-reports").remove([reportPath]);
      }
    }

    // Delete the review from database
    const { error: deleteError } = await adminClient
      .from("reviews")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting review:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete review" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
