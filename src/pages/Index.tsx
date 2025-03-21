// src/pages/index.tsx
import { useState, useEffect } from 'react';
import FilterForm from '@/components/FilterForm';
import ResultsGrid from '@/components/ResultsGrid';
import { FilterCriteria, Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import supabase from '@/config/supabaseClient';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching products from Supabase...');
        const { data, error } = await supabase
          .from('expansion_joint_responses')
          .select('*');

        if (error) throw error;

        console.log('Raw Supabase data:', data);

        const mappedProducts: Product[] = data.map((item) => ({
          id: item.id,
          name: item.product_name,
          company: item.company_name,
          nominalJointWidth: item.min_nominal_width,
          minJointWidth: item.min_nominal_width,
          maxJointWidth: item.max_nominal_width,
          compatibleMovementTypes: item.movement_type,
          suitableLocations: item.location,
          maxLoadingCapacity: item.max_loading,
          suitableJointPlacements: item.joint_placement,
          specialFeatures: item.special_requirements,
          suitableBuildingTypes: item.building_type,
          imageUrl: item.product_image,
          description: null,
          technicalDetails: item.aesthetics ? 'Aesthetic design' : null,
          alternativeProducts: [],
        }));

        console.log('Mapped products:', mappedProducts);
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products from Supabase:', error);
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleFilterSubmit = async (criteria: FilterCriteria) => {
    try {
      setIsLoading(true);
      let query = supabase.from('expansion_joint_responses').select('*');

      // Server-side filters
      if (!criteria.skipWidth && criteria.nominalJointWidth !== null) {
        query = query
          .lte('min_nominal_width', criteria.nominalJointWidth) // min <= nominal
          .gte('max_nominal_width', criteria.nominalJointWidth); // max >= nominal
      }

      if (criteria.movementTypes.length > 0) {
        query = query.contains('movement_type', criteria.movementTypes);
      }
      if (criteria.locations.length > 0) {
        query = query.contains('location', criteria.locations);
      }
      if (criteria.maxLoadings.length > 0) {
        query = query.contains('max_loading', criteria.maxLoadings);
      }
      if (criteria.jointPlacements.length > 0) {
        query = query.contains('joint_placement', criteria.jointPlacements);
      }
      if (criteria.specialRequirements.length > 0) {
        query = query.contains('special_requirements', criteria.specialRequirements);
      }
      if (criteria.buildingTypes.length > 0) {
        query = query.contains('building_type', criteria.buildingTypes);
      }
      if (criteria.aesthetics ==true) {
        query = query.eq('aesthetics', true);
      }
      const { data, error } = await query;

      if (error) throw error;

      console.log('Filtered Supabase data (pre-percentage):', data);

      // Client-side percentage filtering
      const filteredData = data.filter((item) => {
        if (criteria.skipWidth) return true;

        if (
          criteria.nominalJointWidth !== null &&
          (criteria.minJointWidth !== null || criteria.maxJointWidth !== null)
        ) {
          const nominal = criteria.nominalJointWidth;
          const minDiff = criteria.minJointWidth !== null
            ? Math.abs(nominal - criteria.minJointWidth)
            : 0;
          const maxDiff = criteria.maxJointWidth !== null
            ? Math.abs(criteria.maxJointWidth - nominal)
            : 0;
          const minPercentage = minDiff > 0 ? (minDiff / nominal) * 100 : 0;
          const maxPercentage = maxDiff > 0 ? (maxDiff / nominal) * 100 : 0;

          const minMovementOk = criteria.minJointWidth === null || minPercentage <= item.min_movement;
          const maxMovementOk = criteria.maxJointWidth === null || maxPercentage <= item.max_movement;

          return minMovementOk && maxMovementOk;
        }

        return true;
      });

      console.log('Post-percentage filtered data:', filteredData);

      const mappedProducts: Product[] = filteredData.map((item) => ({
        id: item.id,
        name: item.product_name,
        company: item.company_name,
        nominalJointWidth: criteria.nominalJointWidth || item.min_nominal_width,
        minJointWidth: item.min_nominal_width,
        maxJointWidth: item.max_nominal_width,
        compatibleMovementTypes: item.movement_type,
        suitableLocations: item.location,
        maxLoadingCapacity: item.max_loading,
        suitableJointPlacements: item.joint_placement,
        specialFeatures: item.special_requirements,
        suitableBuildingTypes: item.building_type,
        imageUrl: item.product_image,
        description: null,
        technicalDetails: item.aesthetics ? 'Aesthetic design' : null,
        alternativeProducts: [],
      }));

      setFilteredProducts(mappedProducts);
      setHasSearched(true);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error filtering products with Supabase:', error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setHasSearched(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    console.log('Rendering loading state...');
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="max-w-4xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mb-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering main content...', { hasSearched, filteredProducts });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background pt-8 pb-6 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-1">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Expansion Joint Finder
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Find the Perfect Expansion Joint Cover
            </h1>
            <p className="text-lg text-muted-foreground">
              Specify your requirements and we'll filter through 800+ products to find your ideal solution
            </p>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 transition-all animate-in">
        {!hasSearched ? (
          <FilterForm onFilterSubmit={handleFilterSubmit} />
        ) : (
          <ResultsGrid products={filteredProducts} onBack={handleBack} />
        )}
      </main>
      <footer className="mt-12 py-6 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-1">Expansion Joint Cover Finder</p>
            <p>Helping professionals find the right joint covers for their projects</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;