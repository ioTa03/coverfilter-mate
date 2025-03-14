
import { createClient } from '@supabase/supabase-js';
import { Product } from '@/types';

// Initialize the Supabase client
// These should be your Supabase project URL and public anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch products from Supabase
export async function fetchProducts(): Promise<Product[]> {
  try {
    // Fetch all products from the 'products' table
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    // If no data is returned, return the sample data as fallback
    if (!data || data.length === 0) {
      console.warn('No products found in database, using sample data');
      // Import sample data dynamically to avoid circular dependencies
      const { sampleProducts } = await import('../data/productData');
      return sampleProducts;
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    // Fallback to sample data in case of any errors
    const { sampleProducts } = await import('../data/productData');
    return sampleProducts;
  }
}

// Function to fetch products with filtering
export async function fetchFilteredProducts(criteria: any): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*');
    
    // Apply filters based on criteria
    if (criteria.nominalJointWidth !== null) {
      query = query.eq('nominalJointWidth', criteria.nominalJointWidth);
    }
    
    if (criteria.minJointWidth !== null) {
      query = query.gte('minJointWidth', criteria.minJointWidth);
    }
    
    if (criteria.maxJointWidth !== null) {
      query = query.lte('maxJointWidth', criteria.maxJointWidth);
    }
    
    // For array fields, we need to use the contains operator
    if (criteria.movementTypes.length > 0) {
      query = query.contains('compatibleMovementTypes', criteria.movementTypes);
    }
    
    if (criteria.locations.length > 0) {
      query = query.contains('suitableLocations', criteria.locations);
    }
    
    if (criteria.projectType !== null) {
      query = query.contains('suitableProjectTypes', [criteria.projectType]);
    }
    
    if (criteria.maxLoadings.length > 0) {
      query = query.contains('maxLoadingCapacity', criteria.maxLoadings);
    }
    
    if (criteria.jointPlacements.length > 0) {
      query = query.contains('suitableJointPlacements', criteria.jointPlacements);
    }
    
    if (criteria.specialRequirements.length > 0) {
      query = query.contains('specialFeatures', criteria.specialRequirements);
    }
    
    if (criteria.buildingTypes.length > 0) {
      query = query.contains('suitableBuildingTypes', criteria.buildingTypes);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error in fetchFilteredProducts:', error);
    // Fallback to client-side filtering in case of database errors
    const { sampleProducts } = await import('../data/productData');
    const { filterProducts } = await import('../lib/filterLogic');
    return filterProducts(sampleProducts, criteria);
  }
}
