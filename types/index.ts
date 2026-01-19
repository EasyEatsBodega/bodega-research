// Database types
export interface Review {
  id: string;
  project_name: string;
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
}

// AI-generated analysis
export interface AIAnalysis {
  publicReceipt: PublicReceipt;
  privateReport: string;
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
  aisle1_pmf: string;
  aisle2_uiux: string;
  aisle3_general: string;
  aisle4_sentiment: string;
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
