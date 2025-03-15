
import { useState, useEffect } from 'react';
import FilterForm from '@/components/FilterForm';
import ResultsGrid from '@/components/ResultsGrid';
import { FilterCriteria, Product } from '@/types';
import { fetchProducts } from '@/data/productData';
import { filterProducts } from '@/lib/filterLogic';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  
  useEffect(() => {
    // Fetch products on initial load
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  const handleFilterSubmit = (criteria: FilterCriteria) => {
    const filtered = filterProducts(products, criteria);
    setFilteredProducts(filtered);
    setHasSearched(true);
    
    // Scroll to top for results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => {
    setHasSearched(false);
    // Scroll to top for filter form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (isLoading) {
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
