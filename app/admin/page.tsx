import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch recent reviews and leads for the dashboard
  const [reviewsResult, leadsResult] = await Promise.all([
    supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <AdminDashboard
      user={user}
      reviews={reviewsResult.data || []}
      leads={leadsResult.data || []}
    />
  );
}
