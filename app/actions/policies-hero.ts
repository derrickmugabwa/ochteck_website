'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PoliciesHero, PoliciesHeroFormData, PoliciesResponse } from "@/types/policies";

/**
 * Get the active policies hero section
 */
export async function getPoliciesHero(): Promise<PoliciesHero | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('policies_hero')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching policies hero:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPoliciesHero:', error);
    return null;
  }
}

/**
 * Update policies hero section
 */
export async function updatePoliciesHero(
  id: string,
  formData: PoliciesHeroFormData
): Promise<PoliciesResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('policies_hero')
      .update({
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        background_image_url: formData.background_image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating policies hero:', error);
      return {
        success: false,
        message: 'Failed to update hero section',
        error: error.message,
      };
    }

    revalidatePath('/policies');
    revalidatePath('/admin/policies');

    return {
      success: true,
      message: 'Hero section updated successfully',
      data,
    };
  } catch (error) {
    console.error('Error in updatePoliciesHero:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload hero background image
 */
export async function uploadPoliciesHeroImage(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `policies-hero-${Date.now()}.${fileExt}`;
    const filePath = `heroes/${fileName}`;

    // Upload to storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Error in uploadPoliciesHeroImage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
