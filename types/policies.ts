// Type definitions for Policies page

export interface PoliciesHero {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  background_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PoliciesSection {
  id: string;
  title: string;
  intro: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon_svg: string;
  purpose: string | null;
  scope: string | null;
  responsibility: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Form data types
export interface PoliciesHeroFormData {
  title: string;
  subtitle: string;
  description: string;
  background_image_url?: string | null;
}

export interface PoliciesSectionFormData {
  title: string;
  intro: string;
  description: string;
}

export interface PolicyFormData {
  title: string;
  slug?: string;
  description: string;
  icon_svg: string;
  purpose?: string;
  scope?: string;
  responsibility?: string;
  order?: number;
  is_active?: boolean;
}

// Response types
export interface PoliciesResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: Policy | Policy[] | PoliciesHero;
}
