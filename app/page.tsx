import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectGrid } from "@/components/market/ProjectGrid";
import { WholesaleInquiry } from "@/components/forms/WholesaleInquiry";
import { HeroSection } from "@/components/market/HeroSection";
import type { Review } from "@/types";

async function getReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error connecting to database:", error);
    return [];
  }
}

export default async function HomePage() {
  const reviews = await getReviews();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero section with bodega background */}
        <div
          className="relative min-h-[100vh] bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: "url('/images/bodega-background.png')" }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content positioned over the counter area */}
          <div className="relative z-10">
            <HeroSection />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <ProjectGrid reviews={reviews} />
          <WholesaleInquiry />
        </div>
      </main>

      <Footer />
    </div>
  );
}
