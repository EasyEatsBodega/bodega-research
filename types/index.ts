// Database types
export interface Review {
  id: string;
  project_name: string;
  brand_image_url: string | null;
  raw_notes: RawNotes;
  ai_data: AIAnalysis | null;
  infographic_url: string | null;
  report_url: string | null;
  rating_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  project_link: string | null;
  email: string;
  telegram_username: string | null;
  preferred_contact: string | null;
  preferred_contact_other: string | null;
  message: string | null;
  created_at: string;
}

// Raw notes structure (Admin input)
export interface RawNotes {
  aisle1_pmf: string; // Product-Market Fit
  aisle2_uiux: string; // UI/UX Quality
  aisle3_general: string; // General App Assessment
  aisle4_sentiment: string; // Social Sentiment
  my_recommendations?: string; // Admin's personal recommendations
}

// Market Intelligence data
export interface MarketIntelligence {
  sector: string; // e.g., "DeFi", "NFT Infrastructure", "Gaming"
  tam: string; // Total Addressable Market (e.g., "$50B")
  tamGrowthRate: string; // e.g., "25% YoY"
  userGrowthPotential: "Low" | "Medium" | "High" | "Very High";
  keyCompetitors: string[]; // 3-5 competitors
  marketTrends: string[]; // 3 key trends
  marketMaturity: "Emerging" | "Growing" | "Mature" | "Declining";
  entryBarrier: "Low" | "Medium" | "High";
}

// AI-generated analysis
export interface AIAnalysis {
  publicReceipt: PublicReceipt;
  privateReport: string;
  marketIntelligence: MarketIntelligence;
}

export interface PublicReceipt {
  theAlpha: string[]; // 3 bullet points - positives
  theFriction: string[]; // 3 bullet points - concerns
  recommendations: string[];
  scores: {
    pmf: number; // 1-10
    ui: number; // 1-10
    sentiment: number; // 1-10
    overall: number; // 1-10
  };
}

// Form types
export interface ReviewFormData {
  projectName: string;
  brandImage: File | null;
  aisle1_pmf: string;
  aisle2_uiux: string;
  aisle3_general: string;
  aisle4_sentiment: string;
  my_recommendations: string;
}

export type ContactMethod = "x_dms" | "email" | "telegram" | "other";

export interface LeadFormData {
  name: string;
  projectLink: string;
  email: string;
  telegramUsername?: string;
  preferredContact: ContactMethod;
  preferredContactOther?: string;
  message: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GenerateReportResponse {
  review: Review;
  infographicUrl: string;
  reportUrl: string;
}

// UI component types
export interface InventoryTagProps {
  review: Review;
  onClick: () => void;
}

export interface ReceiptModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

export interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}
