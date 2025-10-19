'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PoliciesSection, PoliciesSectionFormData, PoliciesResponse } from "@/types/policies";

/**
 * Get the active policies section header
 */
export async function getPoliciesSection(): Promise<PoliciesSection | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('policies_section')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching policies section:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPoliciesSection:', error);
    return null;
  }
}

/**
 * Update policies section header
 */
export async function updatePoliciesSection(
  id: string,
  formData: PoliciesSectionFormData
): Promise<PoliciesResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('policies_section')
      .update({
        title: formData.title,
        intro: formData.intro,
        description: formData.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating policies section:', error);
      return {
        success: false,
        message: 'Failed to update section header',
        error: error.message,
      };
    }

    revalidatePath('/policies');
    revalidatePath('/admin/policies');

    return {
      success: true,
      message: 'Section header updated successfully',
      data,
    };
  } catch (error) {
    console.error('Error in updatePoliciesSection:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
