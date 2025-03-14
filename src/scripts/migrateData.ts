
import { supabase } from '@/lib/supabase';
import { sampleProducts } from '@/data/productData';

/**
 * This is a utility script to migrate sample data to Supabase.
 * You can run this script manually in your browser console after setting up Supabase.
 * 
 * Steps to use:
 * 1. Make sure your Supabase environment variables are set
 * 2. Open browser console in development mode
 * 3. Call window.migrateDataToSupabase()
 */

export async function migrateDataToSupabase() {
  try {
    console.log('Starting data migration to Supabase...');
    
    // Check if the table exists by trying to select from it
    const { error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    // If table doesn't exist, log error and return
    if (checkError) {
      console.error('Error: The products table does not exist in your Supabase database.');
      console.log('Please create a "products" table with the appropriate schema first.');
      console.log('Schema should match the Product type in your application.');
      return;
    }
    
    // Insert all sample products
    const { data, error } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();
    
    if (error) {
      console.error('Error migrating data:', error);
      return;
    }
    
    console.log(`Successfully migrated ${data.length} products to Supabase.`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Add to window object for access in browser console
if (typeof window !== 'undefined') {
  (window as any).migrateDataToSupabase = migrateDataToSupabase;
}
