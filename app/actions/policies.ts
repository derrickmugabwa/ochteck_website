'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Policy, PolicyFormData, PoliciesResponse } from "@/types/policies";

/**
 * Get all active policies (public)
 */
export async function getPolicies(): Promise<Policy[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching policies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPolicies:', error);
    return [];
  }
}

/**
 * Get all policies including inactive (admin)
 */
export async function getAllPolicies(): Promise<Policy[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching all policies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllPolicies:', error);
    return [];
  }
}

/**
 * Get a single policy by ID
 */
export async function getPolicy(id: string): Promise<Policy | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching policy:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPolicy:', error);
    return null;
  }
}

/**
 * Get a single policy by slug (for public pages)
 */
export async function getPolicyBySlug(slug: string): Promise<Policy | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching policy by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPolicyBySlug:', error);
    return null;
  }
}

/**
 * Create a new policy
 */
export async function createPolicy(
  formData: PolicyFormData
): Promise<PoliciesResponse> {
  try {
    const supabase = await createClient();

    // Get the highest order number and add 1
    const { data: maxOrderData } = await supabase
      .from('policies')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxOrderData ? maxOrderData.order + 1 : 1;

    // Generate slug from title if not provided
    const slug = formData.slug || formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('policies')
      .insert({
        title: formData.title,
        slug: slug,
        description: formData.description,
        icon_svg: formData.icon_svg,
        purpose: formData.purpose || null,
        scope: formData.scope || null,
        responsibility: formData.responsibility || null,
        order: formData.order ?? nextOrder,
        is_active: formData.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating policy:', error);
      return {
        success: false,
        message: 'Failed to create policy',
        error: error.message,
      };
    }

    revalidatePath('/policies');
    revalidatePath('/admin/policies');

    return {
      success: true,
      message: 'Policy created successfully',
      data,
    };
  } catch (error) {
    console.error('Error in createPolicy:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update an existing policy
 */
export async function updatePolicy(
  id: string,
  formData: PolicyFormData
): Promise<PoliciesResponse> {
  try {
    const supabase = await createClient();

    // Generate slug from title if not provided
    const slug = formData.slug || formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('policies')
      .update({
        title: formData.title,
        slug: slug,
        description: formData.description,
        icon_svg: formData.icon_svg,
        purpose: formData.purpose || null,
        scope: formData.scope || null,
        responsibility: formData.responsibility || null,
        order: formData.order,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating policy:', error);
      return {
        success: false,
        message: 'Failed to update policy',
        error: error.message,
      };
    }

    revalidatePath('/policies');
    revalidatePath('/admin/policies');

    return {
      success: true,
      message: 'Policy updated successfully',
      data,
    };
  } catch (error) {
    console.error('Error in updatePolicy:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a policy
 */
export async function deletePolicy(id: string): Promise<PoliciesResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting policy:', error);
      return {
        success: false,
        message: 'Failed to delete policy',
        error: error.message,
      };
    }

    revalidatePath('/policies');
    revalidatePath('/admin/policies');

    return {
      success: true,
      message: 'Policy deleted successfully',
    };
  } catch (error) {
    console.error('Error in deletePolicy:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Reorder policies
 */
export async function reorderPolicies(
  policies: { id: string; order: number }[]
): Promise<PoliciesResponse> {
  try {
    const supabase = await createClient();

    // Update each policy's order
    const updates = policies.map(({ id, order }) =>
      supabase
        .from('policies')
        .update({ order })
        .eq('id', id)
    );

    const results = await Promise.all(updates);
    
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Error reordering policies:', errors);
      return {
        success: false,
        message: 'Failed to reorder some policies',
        error: errors[0].error?.message,
      };
    }

    revalidatePath('/policies');
    revalidatePath('/admin/policies');

    return {
      success: true,
      message: 'Policies reordered successfully',
    };
  } catch (error) {
    console.error('Error in reorderPolicies:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Toggle policy active status
 */
export async function togglePolicyStatus(
  id: string,
  isActive: boolean
): Promise<PoliciesResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('policies')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling policy status:', error);
      return {
        success: false,
        message: 'Failed to update policy status',
        error: error.message,
      };
    }

    revalidatePath('/policies');
    revalidatePath('/admin/policies');

    return {
      success: true,
      message: `Policy ${isActive ? 'activated' : 'deactivated'} successfully`,
      data,
    };
  } catch (error) {
    console.error('Error in togglePolicyStatus:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
